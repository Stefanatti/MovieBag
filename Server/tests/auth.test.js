const { test, before, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const connectionPath = require.resolve("../modules/connection");
require.cache[connectionPath] = { id: connectionPath, loaded: true, exports: mongoose };
const User = require("../modules/userModule");
const { verifySession } = require("../utils/sessionToken");

const id = "507f1f77bcf86cd799439011";
const legacyPassword = "old";
const newPassword = "A much longer password";
let oldHash;
let server;

before(async () => {
  process.env.TOKEN_KEY = "local-auth-test-key";
  process.env.TOKEN_EXPIRES_IN = "1d";
  process.env.CLIENT_URL = "https://moviebag.example";
  oldHash = await bcrypt.hash(legacyPassword, 4);
});

beforeEach(async () => {
  // Reload the router so each test gets its own rate limit counters.
  delete require.cache[require.resolve("../routers/userRoute")];
  const app = express();
  app.use(express.json(), cookieParser());
  app.use("/user", require("../routers/userRoute"));
  server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
});

afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
});

const request = async (path, body, cookie) => {
  const headers = {};
  if (cookie) headers.Cookie = cookie;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(`http://127.0.0.1:${server.address().port}/user${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, headers: response.headers, body: await response.json() };
};

test("validates request fields before looking up or creating accounts", async (t) => {
  for (const method of ["findOne", "create", "exists"]) {
    t.mock.method(User, method, () => assert.fail(`Unexpected ${method}`));
  }
  assert.equal((await request("/login", { username: [], password: "example" })).status, 400);
  assert.equal((await request("/forgot_password", { email: 123 })).status, 400);
  assert.equal((await request("/signup", { username: "Viewer", email: "bad", password: newPassword })).status, 400);
  for (const password of ["four", "🍿".repeat(19)]) {
    assert.equal((await request("/signup", { username: "Viewer", email: "viewer@example.com", password })).status, 400);
  }
});

test("normalizes new account details and hashes a five-character password", async (t) => {
  const signupPassword = "abcde";
  t.mock.method(User, "create", async ({ username, email, password }) => {
    assert.equal(username, "Viewer");
    assert.equal(email, "viewer@example.com");
    assert.notEqual(password, signupPassword);
    assert.equal(await bcrypt.compare(signupPassword, password), true);
  });
  assert.equal((await request("/signup", {
    username: " Viewer ", email: " Viewer@Example.COM ", password: signupPassword,
  })).status, 201);
});

test("sign-up identifies a registered email without exposing database errors", async (t) => {
  t.mock.method(User, "create", async () => {
    throw Object.assign(new Error("Internal database details"), {
      code: 11000, keyPattern: { email: 1 },
    });
  });
  const result = await request("/signup", {
    username: "Viewer", email: "viewer@example.com", password: "abcde",
  });
  assert.equal(result.status, 409);
  assert.deepEqual(result.body, {
    message: "This email is already registered. Log in or reset your password.",
    fieldErrors: { email: "This email is already registered. Log in or reset your password." },
  });
});

test("sign-up validation reports every invalid field", async () => {
  const result = await request("/signup", { username: "", email: "invalid", password: "four" });
  assert.equal(result.status, 400);
  assert.deepEqual(Object.keys(result.body.fieldErrors).sort(), ["email", "password", "username"]);
});

test("login failures do not distinguish unknown usernames from bad passwords", async (t) => {
  t.mock.method(User, "findOne", async ({ username }) =>
    username === "Viewer" ? { _id: id, username, password: oldHash } : null);
  const wrongPassword = await request("/login", { username: "Viewer", password: "wrong" });
  const unknownUser = await request("/login", { username: "Someone", password: "wrong" });
  assert.equal(wrongPassword.status, 401);
  assert.equal(wrongPassword.body.message, "Incorrect username or password.");
  assert.equal(unknownUser.status, 401);
  assert.deepEqual(unknownUser.body, wrongPassword.body);
});

test("an emailed reset link expires or is consumed once and revokes existing sessions", async (t) => {
  const user = { _id: id, username: "Viewer", email: "viewer@example.com", password: oldHash };
  t.mock.method(User, "findOne", async (filter) =>
    filter.email === user.email || filter.username === user.username ? user : null);
  t.mock.method(User, "findById", async (value) => value === id ? user : null);
  const matches = (filter) =>
    filter._id === id && filter.passwordResetDigest === user.passwordResetDigest &&
    user.passwordResetExpiresAt > filter.passwordResetExpiresAt.$gt;
  t.mock.method(User, "exists", async (filter) => matches(filter) ? { _id: id } : null);
  t.mock.method(User, "updateOne", async (filter, update) => {
    if (update.$inc && !matches(filter)) return { modifiedCount: 0 };
    Object.assign(user, update.$set);
    if (update.$inc) {
      user.sessionVersion = (user.sessionVersion ?? 0) + update.$inc.sessionVersion;
      for (const key of Object.keys(update.$unset)) delete user[key];
    }
    return { matchedCount: 1, modifiedCount: 1 };
  });
  let mail;
  t.mock.method(nodemailer, "createTransport", (options) => {
    assert.notEqual(options.tls?.rejectUnauthorized, false);
    return { sendMail: async (message) => { mail = message; } };
  });

  const login = await request("/login", { username: user.username, password: legacyPassword });
  assert.equal(login.status, 200);
  const setCookie = login.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/i);
  const cookie = setCookie.split(";")[0];
  assert.equal((await request("/verify", undefined, cookie)).status, 200);

  const known = await request("/forgot_password", { email: user.email });
  const unknown = await request("/forgot_password", { email: "unknown@example.com" });
  assert.equal(known.status, 200);
  assert.equal(unknown.status, known.status);
  assert.deepEqual(known.body, unknown.body);
  assert.equal(mail.to, user.email);
  const url = new URL(mail.text.match(/https:\/\/\S+/)[0]);
  assert.equal(url.origin, "https://moviebag.example");
  const resetPath = url.pathname;
  assert.throws(() => verifySession(resetPath.split("/").pop()));
  assert.ok(user.passwordResetExpiresAt > new Date());
  assert.ok(!resetPath.includes(user.passwordResetDigest));

  const expiresAt = user.passwordResetExpiresAt;
  user.passwordResetExpiresAt = new Date(0);
  assert.equal((await request(resetPath, { newPassword })).status, 400);
  user.passwordResetExpiresAt = expiresAt;
  const results = await Promise.all([request(resetPath, { newPassword }), request(resetPath, { newPassword })]);
  assert.deepEqual(results.map(({ status }) => status).sort(), [200, 400]);
  assert.equal(user.sessionVersion, 1);
  assert.equal((await request("/verify", undefined, cookie)).status, 401);
  assert.equal((await request("/login", { username: user.username, password: legacyPassword })).status, 401);
  const freshLogin = await request("/login", { username: user.username, password: newPassword });
  assert.equal(freshLogin.status, 200);
  const freshCookie = freshLogin.headers.get("set-cookie").split(";")[0];
  assert.equal((await request("/verify", undefined, freshCookie)).status, 200);
});

test("recovery rate limit returns 429 and Retry-After at the configured threshold", async (t) => {
  const lookup = t.mock.method(User, "findOne", async () => null);
  for (let i = 0; i < 5; i += 1) {
    assert.equal((await request("/forgot_password", { email: "viewer@example.com" })).status, 200);
  }
  const limited = await request("/forgot_password", { email: "viewer@example.com" });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
  assert.equal(lookup.mock.callCount(), 5);
});
