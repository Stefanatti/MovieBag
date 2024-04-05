require("dotenv").config({ path: ".env" });

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// const url = `${process.env.API_URL}/?apikey=${process.env.API_KEY}`;
const url = process.env.API_URL;
const apikey = process.env.API_KEY;
const options = {
  method: "GET",
};

const searchForMoviesAndTvShows = async (req, res) => {
  try {
    const query = req.params.search;
    const response = await fetch(
      `${url}search/multi?query=${query}&api_key=${apikey}`,
      options
    );
    const json = await response.json();
    const sortedResults = json.results.sort(
      (a, b) => b.vote_count - a.vote_count
    );
    res.send(sortedResults);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching movies data." });
  }
};

const getPopularMovies = async (req, res) => {
  try {
    const response = await fetch(
      `${url}movie/popular?language=en-US&page=1&api_key=${apikey}`,
      options
    );
    const json = await response.json();
    const movies = json.results.map((movie) => ({
      title: movie.title,
      id: movie.id,
      poster_path: movie.poster_path,
    }));
    res.send(movies);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching movies data." });
  }
};

const searchForOneMovie = async (req, res) => {
  const query = req.params.id;
  try {
    const response = await fetch(
      `${url}movie/${query}?&append_to_response=credits,videos&api_key=${apikey}`,
      options
    );
    const json = await response.json();
    res.send(json);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching movie data." });
  }
};

const searchForOneTvShow = (req, res) => {
  const query = req.params.id;
  fetch(
    `${url}tv/${query}?&append_to_response=credits,videos&api_key=${apikey}`,
    options
  )
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((err) => console.error("error:" + err));
};

module.exports = {
  searchForMoviesAndTvShows,
  searchForOneMovie,
  searchForOneTvShow,
  getPopularMovies,
};
