const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Keep route tests offline while using the real Mongoose schemas.
const connectionPath = require.resolve("../modules/connection");
const originalConnection = require.cache[connectionPath];
require.cache[connectionPath] = { id: connectionPath, filename: connectionPath, loaded: true, exports: mongoose };
const Review = require("../modules/reviewModule");
const User = require("../modules/userModule");
const reviewRouter = require("../routers/reviewRoute");

const authorId = "507f1f77bcf86cd799439011";
const otherId = "507f1f77bcf86cd799439012";
const reviewId = "507f1f77bcf86cd799439013";
const secret = "local-review-test-key";
const originalKey = process.env.TOKEN_KEY;
let server;
let baseUrl;

const review = {
  _id: reviewId,
  author: { _id: authorId, username: "Reviewer", email: "private@example.invalid", password: "private" },
  tmdbId: "123",
  mediaType: "movie",
  text: "A thoughtful film.",
  containsSpoilers: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

const query = (value, onPopulate = () => {}) => ({
  sort() { return this; },
  skip() { return this; },
  limit() { return this; },
  populate(selection) { onPopulate(selection); return this; },
  lean: async () => value,
});

const request = async (path, { method = "GET", body, authenticated = false, token } = {}) => {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (authenticated || token) {
    headers.Cookie = `token=${token || jwt.sign({ id: authorId }, secret, { expiresIn: "1h" })}`;
  }
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json(), headers: response.headers };
};

before(async () => {
  process.env.TOKEN_KEY = secret;
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/reviews", reviewRouter);
  server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/reviews`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  if (originalKey === undefined) delete process.env.TOKEN_KEY;
  else process.env.TOKEN_KEY = originalKey;
  if (originalConnection) require.cache[connectionPath] = originalConnection;
  else delete require.cache[connectionPath];
});

test("schema enforces review bounds and one review per author/type/title", async () => {
  const indexes = Review.schema.indexes();
  assert.ok(indexes.some(([keys, options]) =>
    options.unique && keys.author === 1 && keys.tmdbId === 1 && keys.mediaType === 1));
  assert.ok(indexes.some(([keys]) =>
    keys.mediaType === 1 && keys.tmdbId === 1 && keys.createdAt === -1 && keys._id === -1));
  assert.ok(indexes.some(([keys]) =>
    keys.author === 1 && keys.createdAt === -1 && keys._id === -1));
  await new Review({ author: authorId, tmdbId: "123", mediaType: "movie", text: "x".repeat(2000) }).validate();
  for (const changes of [{ text: " " }, { text: "x".repeat(2001) }, { mediaType: "episode" }]) {
    await assert.rejects(new Review({
      author: authorId, tmdbId: "123", mediaType: "movie", text: "Valid", ...changes,
    }).validate(), { name: "ValidationError" });
  }
});

test("public listing is paginated, sorted and only exposes public author fields", async (t) => {
  const selection = [];
  const chain = query([review], (value) => selection.push(value));
  t.mock.method(chain, "sort", (value) => { assert.deepEqual(value, { createdAt: -1, _id: -1 }); return chain; });
  t.mock.method(chain, "skip", (value) => { assert.equal(value, 5); return chain; });
  t.mock.method(chain, "limit", (value) => { assert.equal(value, 5); return chain; });
  t.mock.method(Review, "find", (filter) => {
    assert.deepEqual(filter, {
      tmdbId: "123", mediaType: "movie",
      $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }],
    });
    return chain;
  });
  t.mock.method(Review, "countDocuments", async () => 6);
  const result = await request("/movie/123?page=2");
  assert.equal(result.status, 200);
  assert.deepEqual({ ...result.body, reviews: [] }, { reviews: [], page: 2, total: 6, totalPages: 2 });
  assert.deepEqual(result.body.reviews[0].author, { _id: authorId, username: "Reviewer" });
  assert.deepEqual(selection, [{ path: "author", select: "username" }]);
});

test("movie and TV titles with identical IDs use separate filters", async (t) => {
  const filters = [];
  t.mock.method(Review, "find", (filter) => { filters.push(filter); return query([]); });
  t.mock.method(Review, "countDocuments", async () => 0);
  for (const type of ["movie", "tv"]) {
    const result = await request(`/${type}/123`);
    assert.deepEqual(result.body, { reviews: [], page: 1, total: 0, totalPages: 0 });
  }
  assert.deepEqual(filters, ["movie", "tv"].map((mediaType) => ({
    mediaType, tmdbId: "123",
    $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }],
  })));
});

test("invalid title IDs, media types and pagination are rejected", async () => {
  for (const path of [
    "/episode/123", "/movie/0", "/movie/-1", "/movie/1.5", "/movie/01",
    "/movie/9007199254740992", "/movie/123?page=0", "/movie/123?page=-1",
    "/movie/123?page=1.5", "/movie/123?page=abc", "/movie/123?page=1&page=2",
    "/movie/123?page=9007199254740991",
  ]) {
    assert.equal((await request(path)).status, 400, path);
  }
});

test("all private routes reject guests and invalid/expired sessions", async () => {
  for (const [method, path] of [
    ["GET", "/mine"],
    ["GET", "/mine/movie/123"], ["POST", "/movie/123"],
    ["PATCH", `/${reviewId}`], ["DELETE", `/${reviewId}`],
  ]) {
    assert.equal((await request(path, { method })).status, 401);
  }
  for (const token of ["invalid", jwt.sign({ id: authorId }, secret, { expiresIn: -1 })]) {
    assert.equal((await request("/movie/123", { method: "POST", token, body: { text: "Hello" } })).status, 401);
  }
});

test("personal history scopes both listing and counts to the session owner across movies and TV", async (t) => {
  const tvReview = { ...review, _id: otherId, mediaType: "tv" };
  const chain = query([review, tvReview]);
  t.mock.method(chain, "sort", (value) => {
    assert.deepEqual(value, { createdAt: -1, _id: -1 });
    return chain;
  });
  t.mock.method(chain, "skip", (value) => { assert.equal(value, 5); return chain; });
  t.mock.method(chain, "limit", (value) => { assert.equal(value, 5); return chain; });
  t.mock.method(Review, "find", (filter) => {
    assert.deepEqual(filter, { author: authorId });
    return chain;
  });
  t.mock.method(Review, "countDocuments", async (filter) => {
    assert.deepEqual(filter, { author: authorId });
    return 7;
  });
  const result = await request(`/mine?page=2&author=${otherId}`, { authenticated: true });
  assert.equal(result.status, 200);
  assert.equal(result.body.page, 2);
  assert.equal(result.body.total, 7);
  assert.equal(result.body.totalPages, 2);
  assert.deepEqual(result.body.reviews.map((item) => item.mediaType), ["movie", "tv"]);
  assert.equal(result.body.reviews[0].author.email, undefined);
});

test("personal history validates pages, handles empty histories and rejects expired sessions", async (t) => {
  t.mock.method(Review, "find", () => query([]));
  t.mock.method(Review, "countDocuments", async () => 0);
  assert.deepEqual((await request("/mine", { authenticated: true })).body, {
    reviews: [], page: 1, total: 0, totalPages: 0,
  });
  for (const page of ["0", "-1", "abc", "1.5", "9007199254740991"]) {
    assert.equal((await request(`/mine?page=${page}`, { authenticated: true })).status, 400);
  }
  const token = jwt.sign({ id: authorId }, secret, { expiresIn: -1 });
  assert.equal((await request("/mine", { token })).status, 401);
});

test("personal history surfaces database failures", async (t) => {
  const log = t.mock.method(console, "error", () => {});
  t.mock.method(Review, "find", () => { throw new Error("offline"); });
  assert.equal((await request("/mine", { authenticated: true })).status, 500);
  assert.equal(log.mock.calls.length, 1);
});

test("own review is retrieved independently of public pagination", async (t) => {
  t.mock.method(Review, "findOne", (filter) => {
    assert.deepEqual(filter, { mediaType: "tv", tmdbId: "123", author: authorId });
    return query({ ...review, mediaType: "tv" });
  });
  const result = await request("/mine/tv/123", { authenticated: true });
  assert.equal(result.status, 200);
  assert.equal(result.body.review._id, reviewId);
  assert.equal(result.body.review.author.email, undefined);
});

test("missing own review returns an explicit null", async (t) => {
  t.mock.method(Review, "findOne", () => query(null));
  assert.deepEqual((await request("/mine/movie/123", { authenticated: true })).body, { review: null });
});

test("create derives ownership from the session, trims text and accepts the 2,000-character boundary", async (t) => {
  t.mock.method(User, "exists", async (filter) => {
    assert.deepEqual(filter, { _id: authorId });
    return { _id: authorId };
  });
  t.mock.method(Review, "create", async (value) => {
    assert.deepEqual(value, { author: authorId, mediaType: "tv", tmdbId: "123", text: "x".repeat(2000), containsSpoilers: true });
    return { ...review, ...value, author: review.author, populate: async () => {} };
  });
  const result = await request("/tv/123", {
    method: "POST", authenticated: true, body: { text: `  ${"x".repeat(2000)}  `, containsSpoilers: true },
  });
  assert.equal(result.status, 201);
  assert.equal(result.body.review.text.length, 2000);
  assert.equal(result.body.review.author.password, undefined);
});

test("invalid bodies and attempted author injection are rejected", async () => {
  for (const body of [
    {}, [], { text: "" }, { text: " \n " }, { text: 42 }, { text: "x".repeat(2001) },
    { text: "Hello", containsSpoilers: "false" }, { text: "Hello", author: otherId },
    { text: { $gt: "" } }, { text: "Hello", tmdbId: "456" },
  ]) {
    assert.equal((await request("/movie/123", { method: "POST", authenticated: true, body })).status, 400);
  }
  assert.equal((await request(`/${reviewId}`, { method: "PATCH", authenticated: true, body: {} })).status, 400);
});

test("duplicate database index errors return conflict", async (t) => {
  t.mock.method(User, "exists", async () => ({ _id: authorId }));
  t.mock.method(Review, "create", async () => { throw Object.assign(new Error("duplicate"), { code: 11000 }); });
  const result = await request("/movie/123", { method: "POST", authenticated: true, body: { text: "Hello" } });
  assert.equal(result.status, 409);
  assert.match(result.body.message, /already reviewed/);
});

test("deleted accounts cannot create reviews", async (t) => {
  t.mock.method(User, "exists", async () => null);
  assert.equal((await request("/movie/123", {
    method: "POST", authenticated: true, body: { text: "Hello" },
  })).status, 401);
});

test("editing atomically scopes writes to the authenticated owner and validates changes", async (t) => {
  t.mock.method(Review, "findOneAndUpdate", (filter, update, options) => {
    assert.deepEqual(filter, { _id: reviewId, author: authorId });
    assert.deepEqual(update, { $set: { text: "Edited" } });
    assert.deepEqual(options, { new: true, runValidators: true });
    return query({ ...review, text: "Edited" });
  });
  const result = await request(`/${reviewId}`, {
    method: "PATCH", authenticated: true, body: { text: " Edited " },
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.review.text, "Edited");
});

test("spoiler-only edits preserve review text", async (t) => {
  t.mock.method(Review, "findOneAndUpdate", (filter, update) => {
    assert.deepEqual(update, { $set: { containsSpoilers: true } });
    return query({ ...review, containsSpoilers: true });
  });
  assert.equal((await request(`/${reviewId}`, {
    method: "PATCH", authenticated: true, body: { containsSpoilers: true },
  })).body.review.text, review.text);
});

test("editing and deleting another user's or a missing review return not found", async (t) => {
  t.mock.method(Review, "findOneAndUpdate", (filter) => {
    assert.equal(filter.author, authorId);
    return query(null);
  });
  t.mock.method(Review, "deleteOne", async (filter) => {
    assert.deepEqual(filter, { _id: reviewId, author: authorId });
    return { deletedCount: 0 };
  });
  assert.equal((await request(`/${reviewId}`, {
    method: "PATCH", authenticated: true, body: { text: "Edited" },
  })).status, 404);
  assert.equal((await request(`/${reviewId}`, { method: "DELETE", authenticated: true })).status, 404);
});

test("owners can delete their review", async (t) => {
  t.mock.method(Review, "deleteOne", async (filter) => {
    assert.deepEqual(filter, { _id: reviewId, author: authorId });
    return { deletedCount: 1 };
  });
  assert.equal((await request(`/${reviewId}`, { method: "DELETE", authenticated: true })).status, 200);
});

test("malformed review IDs are rejected before reaching the database", async () => {
  for (const method of ["PATCH", "DELETE"]) {
    assert.equal((await request("/invalid", {
      method, authenticated: true, body: method === "PATCH" ? { text: "Hello" } : undefined,
    })).status, 400);
  }
});

test("orphaned authors are represented without leaking account fields", async (t) => {
  t.mock.method(Review, "find", () => query([{ ...review, author: null }]));
  t.mock.method(Review, "countDocuments", async () => 1);
  assert.equal((await request("/movie/123")).body.reviews[0].author, null);
});

test("database failures are logged and surfaced as errors", async (t) => {
  const failure = new Error("offline database");
  const log = t.mock.method(console, "error", () => {});
  t.mock.method(Review, "find", () => { throw failure; });
  const result = await request("/movie/123");
  assert.equal(result.status, 500);
  assert.match(result.body.message, /Unable to process/);
  assert.equal(log.mock.calls[0].arguments[1], failure);
});

test("public lists and counts exclude private reviews for guests, owners and other accounts", async (t) => {
  const expected = {
    mediaType: "movie", tmdbId: "123",
    $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }],
  };
  t.mock.method(Review, "find", (filter) => {
    assert.deepEqual(filter, expected);
    return query([review, { ...review, _id: otherId, isPrivate: false }]);
  });
  t.mock.method(Review, "countDocuments", async (filter) => {
    assert.deepEqual(filter, expected);
    return 2;
  });
  for (const options of [{}, { authenticated: true }, { token: jwt.sign({ id: otherId }, secret) }]) {
    const result = await request("/movie/123?isPrivate=true", options);
    assert.equal(result.status, 200);
    assert.equal(result.body.total, 2);
    assert.ok(result.body.reviews.every((item) => item.isPrivate === false));
    assert.equal(result.headers.get("cache-control"), "no-store");
  }
});

test("owners can retrieve private reviews through both owner-only endpoints", async (t) => {
  const privateReview = { ...review, isPrivate: true };
  t.mock.method(Review, "findOne", (filter) => {
    assert.deepEqual(filter, { author: authorId, mediaType: "movie", tmdbId: "123" });
    return query(privateReview);
  });
  t.mock.method(Review, "find", (filter) => {
    assert.deepEqual(filter, { author: authorId });
    return query([privateReview]);
  });
  t.mock.method(Review, "countDocuments", async (filter) => {
    assert.deepEqual(filter, { author: authorId });
    return 1;
  });
  const own = await request("/mine/movie/123", { authenticated: true });
  assert.equal(own.body.review.isPrivate, true);
  assert.equal(own.headers.get("cache-control"), "no-store");
  const history = await request("/mine", { authenticated: true });
  assert.equal(history.body.reviews[0].isPrivate, true);
  assert.equal(history.headers.get("cache-control"), "no-store");
});

test("another account's own-review endpoint cannot retrieve the author's private review", async (t) => {
  t.mock.method(Review, "findOne", (filter) => {
    assert.equal(filter.author, otherId);
    return query(null);
  });
  assert.deepEqual((await request("/mine/movie/123", {
    token: jwt.sign({ id: otherId }, secret),
  })).body, { review: null });
});

test("creation accepts private reviews and legacy reviews default to public", async (t) => {
  const legacy = new Review({ author: authorId, tmdbId: "123", mediaType: "movie", text: "Hello" });
  assert.equal(legacy.isPrivate, false);
  t.mock.method(User, "exists", async () => ({ _id: authorId }));
  t.mock.method(Review, "create", async (value) => {
    assert.deepEqual(value, {
      author: authorId, tmdbId: "123", mediaType: "movie", text: "My notes", isPrivate: true,
    });
    return { ...review, ...value, author: review.author, populate: async () => {} };
  });
  const result = await request("/movie/123", {
    method: "POST", authenticated: true, body: { text: "My notes", isPrivate: true },
  });
  assert.equal(result.status, 201);
  assert.equal(result.body.review.isPrivate, true);
  assert.equal(result.body.message, "Private review saved.");
});

test("visibility-only edits preserve content and remain restricted to the owner", async (t) => {
  let visibility = true;
  t.mock.method(Review, "findOneAndUpdate", (filter, update, options) => {
    assert.deepEqual(filter, { _id: reviewId, author: authorId });
    assert.deepEqual(update, { $set: { isPrivate: visibility } });
    assert.equal(options.runValidators, true);
    return query({ ...review, isPrivate: visibility });
  });
  for (const isPrivate of [true, false]) {
    visibility = isPrivate;
    const result = await request(`/${reviewId}`, {
      method: "PATCH", authenticated: true, body: { isPrivate },
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.review.isPrivate, isPrivate);
    assert.equal(result.body.review.text, review.text);
  }
});

test("non-owners cannot publish or make another user's review private", async (t) => {
  t.mock.method(Review, "findOneAndUpdate", (filter) => {
    assert.deepEqual(filter, { _id: reviewId, author: otherId });
    return query(null);
  });
  for (const isPrivate of [true, false]) {
    const result = await request(`/${reviewId}`, {
      method: "PATCH", token: jwt.sign({ id: otherId }, secret), body: { isPrivate },
    });
    assert.equal(result.status, 404);
  }
});

test("privacy flags must be actual booleans for both creation and edits", async () => {
  for (const isPrivate of ["true", "false", null, 0, 1, [], { $ne: false }]) {
    for (const [method, path] of [["POST", "/movie/123"], ["PATCH", `/${reviewId}`]]) {
      const result = await request(path, {
        method, authenticated: true, body: { text: "Hello", isPrivate },
      });
      assert.equal(result.status, 400);
      assert.match(result.body.message, /privacy flag/);
    }
  }
});

test("visibility lifecycle removes private text and counts from public responses while preserving owner access", async (t) => {
  const records = [
    { ...review, isPrivate: false },
    { ...review, _id: otherId, author: { _id: otherId, username: "Other" }, text: "Other private notes", isPrivate: true },
    { ...review, _id: "507f1f77bcf86cd799439014", author: { _id: otherId, username: "Other" }, text: "Legacy public text" },
  ];
  const matches = (row, filter) => Object.entries(filter).every(([key, value]) => {
    if (key === "$or") {
      return value.some((condition) => Object.entries(condition).every(([field, expected]) =>
        typeof expected === "object"
          ? Object.hasOwn(row, field) === expected.$exists
          : row[field] === expected));
    }
    return (key === "author" ? row.author._id : row[key]) === value;
  });
  t.mock.method(Review, "find", (filter) => query(records.filter((row) => matches(row, filter))));
  t.mock.method(Review, "countDocuments", async (filter) => records.filter((row) => matches(row, filter)).length);
  t.mock.method(Review, "findOne", (filter) => query(records.find((row) => matches(row, filter)) || null));
  t.mock.method(Review, "findOneAndUpdate", (filter, update) => {
    const row = records.find((item) => matches(item, filter));
    if (row) Object.assign(row, update.$set);
    return query(row || null);
  });

  const assertPublic = async (texts) => {
    for (const options of [{}, { authenticated: true }, { token: jwt.sign({ id: otherId }, secret) }]) {
      const result = await request("/movie/123", options);
      assert.equal(result.body.total, texts.length);
      assert.deepEqual(result.body.reviews.map((item) => item.text), texts);
    }
  };
  await assertPublic([review.text, "Legacy public text"]);
  const privatized = await request(`/${reviewId}`, {
    method: "PATCH", authenticated: true, body: { isPrivate: true },
  });
  assert.equal(privatized.status, 200);
  await assertPublic(["Legacy public text"]);
  const own = await request("/mine/movie/123", { authenticated: true });
  assert.equal(own.body.review.text, review.text);
  assert.equal(own.body.review.isPrivate, true);
  const ownHistory = await request("/mine", { authenticated: true });
  assert.equal(ownHistory.body.total, 1);
  assert.equal(ownHistory.body.reviews[0].isPrivate, true);
  const denied = await request(`/${reviewId}`, {
    method: "PATCH", token: jwt.sign({ id: otherId }, secret), body: { isPrivate: false },
  });
  assert.equal(denied.status, 404);
  await assertPublic(["Legacy public text"]);
  const published = await request(`/${reviewId}`, {
    method: "PATCH", authenticated: true, body: { isPrivate: false },
  });
  assert.equal(published.status, 200);
  await assertPublic([review.text, "Legacy public text"]);
});
