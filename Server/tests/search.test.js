const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("node:http");

test("search encodes provider queries and keeps relevant movie and TV results in order", async (t) => {
  const query = "Dune? #Part 2 & 3";
  let requestedUrl;
  const upstream = createServer((req, res) => {
    requestedUrl = new URL(req.url, "http://localhost");
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        results: [
          { id: 2, media_type: "tv", vote_count: 1 },
          { id: 3, media_type: "person", vote_count: 1000 },
          { id: 1, media_type: "movie", vote_count: 100 },
        ],
      }),
    );
  });

  await new Promise((resolve, reject) => {
    upstream.once("error", reject);
    upstream.listen(0, "127.0.0.1", resolve);
  });

  const originalApiUrl = process.env.API_URL;
  const originalApiKey = process.env.API_KEY;
  t.after(async () => {
    if (originalApiUrl === undefined) delete process.env.API_URL;
    else process.env.API_URL = originalApiUrl;
    if (originalApiKey === undefined) delete process.env.API_KEY;
    else process.env.API_KEY = originalApiKey;
    await new Promise((resolve) => upstream.close(resolve));
  });

  process.env.API_URL = `http://127.0.0.1:${upstream.address().port}/`;
  process.env.API_KEY = "test-api-key";
  const { searchForMoviesAndTvShows } = require("../controllers/apiController");
  const response = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };

  await searchForMoviesAndTvShows({ params: { search: query } }, response);

  assert.equal(response.statusCode, undefined);
  assert.equal(requestedUrl.searchParams.get("query"), query);
  assert.equal(requestedUrl.searchParams.get("api_key"), "test-api-key");
  assert.deepEqual(
    response.body.map(({ id }) => id),
    [2, 1],
  );
});
