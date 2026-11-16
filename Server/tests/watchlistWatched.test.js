const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Keep route tests offline while using the real Mongoose models.
const connectionPath = require.resolve("../modules/connection");
const originalConnection = require.cache[connectionPath];
require.cache[connectionPath] = { id: connectionPath, filename: connectionPath, loaded: true, exports: mongoose };
const WatchlistMovie = require("../modules/watchlistMovieModule");
const WatchlistTvShow = require("../modules/watchlistTvShowModule");
const Movie = require("../modules/movieModule");
const TvShow = require("../modules/tvShowModule");
const watchlistMovieRouter = require("../routers/watchlistMovieRoute");
const watchlistTvShowRouter = require("../routers/watchlistTvShowRoute");

const ownerId = "507f1f77bcf86cd799439011";
const itemId = "507f1f77bcf86cd799439021";
const secret = "local-watchlist-test-key";
const originalKey = process.env.TOKEN_KEY;
const originals = [];
let server;
let baseUrl;

const stub = (Model, method, impl) => {
  originals.push([Model, method, Model[method]]);
  Model[method] = impl;
};

const request = async (path, { authenticated = true } = {}) => {
  const headers = {};
  if (authenticated) headers.Cookie = `token=${jwt.sign({ id: ownerId }, secret, { expiresIn: "1h" })}`;
  const response = await fetch(`${baseUrl}${path}`, { method: "POST", headers });
  return { status: response.status, body: await response.json() };
};

const cases = [
  {
    name: "movie",
    path: "/watchlist/movie",
    Watchlist: WatchlistMovie,
    Library: Movie,
    item: { _id: itemId, id: "550", title: "Fight Club", year: "1999", type: "movie", director: "David Fincher", poster: "/p.jpg", plot: "Plot", watched: false, owner: ownerId },
    expected: { owner: ownerId, id: "550", title: "Fight Club", year: "1999", type: "movie", director: "David Fincher", poster: "/p.jpg" },
  },
  {
    name: "tv show",
    path: "/watchlist/tvShow",
    Watchlist: WatchlistTvShow,
    Library: TvShow,
    item: { _id: itemId, id: "1396", name: "Breaking Bad", year: "2008", type: "tv", creator: "Vince Gilligan", poster: "/b.jpg", plot: "Plot", watched: false, owner: ownerId },
    expected: { owner: ownerId, id: "1396", name: "Breaking Bad", year: "2008", type: "tv", creator: "Vince Gilligan", poster: "/b.jpg" },
  },
];

before(async () => {
  process.env.TOKEN_KEY = secret;
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/watchlist/movie", watchlistMovieRouter);
  app.use("/watchlist/tvShow", watchlistTvShowRouter);
  server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(() => {
  while (originals.length) {
    const [Model, method, original] = originals.pop();
    Model[method] = original;
  }
});

after(async () => {
  originals.forEach(([Model, method, original]) => { Model[method] = original; });
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  if (originalKey === undefined) delete process.env.TOKEN_KEY;
  else process.env.TOKEN_KEY = originalKey;
  if (originalConnection) require.cache[connectionPath] = originalConnection;
  else delete require.cache[connectionPath];
});

for (const c of cases) {
  test(`${c.name}: moves an owned watchlist item into the library`, async () => {
    const calls = {};
    stub(c.Watchlist, "findOne", (filter) => {
      calls.find = filter;
      return { lean: async () => c.item };
    });
    stub(c.Library, "updateOne", async (filter, update, options) => {
      calls.update = { filter, update, options };
      return { upsertedCount: 1 };
    });
    stub(c.Watchlist, "deleteOne", async (filter) => {
      calls.delete = filter;
      return { deletedCount: 1 };
    });

    const res = await request(`${c.path}/${itemId}/watched`);
    assert.equal(res.status, 200);
    assert.equal(res.body.alreadyInLibrary, false);
    assert.deepEqual(calls.find, { _id: itemId, owner: ownerId });
    assert.deepEqual(calls.update.filter, { id: c.item.id, owner: ownerId });
    assert.deepEqual(calls.update.update, { $setOnInsert: c.expected });
    assert.equal(calls.update.options.upsert, true);
    assert.deepEqual(calls.delete, { _id: itemId, owner: ownerId });
  });

  test(`${c.name}: does not duplicate titles already in the library`, async () => {
    stub(c.Watchlist, "findOne", () => ({ lean: async () => c.item }));
    stub(c.Library, "updateOne", async () => ({ upsertedCount: 0, matchedCount: 1 }));
    let deleted = false;
    stub(c.Watchlist, "deleteOne", async () => { deleted = true; return { deletedCount: 1 }; });

    const res = await request(`${c.path}/${itemId}/watched`);
    assert.equal(res.status, 200);
    assert.equal(res.body.alreadyInLibrary, true);
    assert.equal(deleted, true);
  });

  test(`${c.name}: returns 404 for items not owned by the user`, async () => {
    stub(c.Watchlist, "findOne", () => ({ lean: async () => null }));
    stub(c.Library, "updateOne", async () => { throw new Error("must not write"); });
    stub(c.Watchlist, "deleteOne", async () => { throw new Error("must not delete"); });

    const res = await request(`${c.path}/${itemId}/watched`);
    assert.equal(res.status, 404);
  });

  test(`${c.name}: keeps the watchlist item when the library write fails`, async () => {
    stub(c.Watchlist, "findOne", () => ({ lean: async () => c.item }));
    stub(c.Library, "updateOne", async () => { throw new Error("db down"); });
    let deleted = false;
    stub(c.Watchlist, "deleteOne", async () => { deleted = true; });
    const originalError = console.error;
    console.error = () => {};
    try {
      const res = await request(`${c.path}/${itemId}/watched`);
      assert.equal(res.status, 500);
      assert.equal(deleted, false);
    } finally {
      console.error = originalError;
    }
  });

  test(`${c.name}: rejects invalid ids and unauthenticated requests`, async () => {
    assert.equal((await request(`${c.path}/not-an-id/watched`)).status, 400);
    assert.equal((await request(`${c.path}/${itemId}/watched`, { authenticated: false })).status, 401);
  });
}
