const { test } = require("node:test");
const assert = require("node:assert/strict");
const { toHomeItem } = require("../controllers/apiController");

test("maps a TMDB movie to the home page shape", () => {
  const movie = {
    id: 550,
    title: "Fight Club",
    poster_path: "/p.jpg",
    backdrop_path: "/b.jpg",
    vote_average: 8.4,
    overview: "An insomniac office worker...",
    release_date: "1999-10-15",
    popularity: 99,
  };
  assert.deepEqual(toHomeItem(movie), {
    title: "Fight Club",
    id: 550,
    poster_path: "/p.jpg",
    backdrop_path: "/b.jpg",
    vote_average: 8.4,
    overview: "An insomniac office worker...",
    year: "1999",
  });
});

test("maps a TMDB TV show using its name and first air date", () => {
  const show = { id: 1396, name: "Breaking Bad", poster_path: "/bb.jpg", vote_average: 8.9, first_air_date: "2008-01-20" };
  assert.deepEqual(toHomeItem(show), {
    title: "Breaking Bad",
    id: 1396,
    poster_path: "/bb.jpg",
    backdrop_path: null,
    vote_average: 8.9,
    overview: "",
    year: "2008",
  });
});

test("leaves the year empty when TMDB has no date", () => {
  assert.equal(toHomeItem({ id: 1, title: "Untitled" }).year, "");
});
