require("dotenv").config({ path: ".env" });
const NodeCache = require("node-cache");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Cache: 1 hour for lists, 30 min for individual movie/show details
const cache = new NodeCache({ stdTTL: 3600 });

const url = process.env.API_URL;
const apikey = process.env.API_KEY;
const options = {
  method: "GET",
};

const searchForMoviesAndTvShows = async (req, res) => {
  try {
    const query = req.params.search;
    const cacheKey = `search_${query}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.send(cached);

    const response = await fetch(
      `${url}search/multi?query=${query}&api_key=${apikey}`,
      options,
    );
    const json = await response.json();
    const sortedResults = json.results.sort(
      (a, b) => b.vote_count - a.vote_count,
    );

    cache.set(cacheKey, sortedResults, 600); // 10 min TTL for searches
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
    const cached = cache.get("popularMovies");
    if (cached) return res.send(cached);

    const response = await fetch(
      `${url}movie/popular?language=en-US&page=1&api_key=${apikey}`,
      options,
    );
    const json = await response.json();
    const movies = json.results.map((movie) => ({
      title: movie.title,
      id: movie.id,
      poster_path: movie.poster_path,
    }));

    cache.set("popularMovies", movies);
    res.send(movies);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching movies data." });
  }
};

const getTopRatedMovies = async (req, res) => {
  try {
    const cached = cache.get("topRatedMovies");
    if (cached) return res.send(cached);

    const response = await fetch(
      `${url}movie/top_rated?language=en-US&page=1&api_key=${apikey}`,
      options,
    );
    const json = await response.json();
    const movies = json.results.map((movie) => ({
      title: movie.title,
      id: movie.id,
      poster_path: movie.poster_path,
    }));

    cache.set("topRatedMovies", movies);
    res.send(movies);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching movies data." });
  }
};

const getPopularTvShows = async (req, res) => {
  try {
    const cached = cache.get("popularTvShows");
    if (cached) return res.send(cached);

    const response = await fetch(
      `${url}discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=US&with_genres=10759%7C80%7C18%7C9648%7C10765&with_origin_country=US&api_key=${apikey}`,
      options,
    );
    const json = await response.json();
    const tvShows = json.results.map((tvShow) => ({
      title: tvShow.name,
      id: tvShow.id,
      poster_path: tvShow.poster_path,
    }));

    cache.set("popularTvShows", tvShows);
    res.send(tvShows);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching tv shows data." });
  }
};

const getTopRatedTvShows = async (req, res) => {
  try {
    const cached = cache.get("topRatedTvShows");
    if (cached) return res.send(cached);

    const response = await fetch(
      `${url}tv/top_rated?language=en-US&page=1&api_key=${apikey}`,
      options,
    );
    const json = await response.json();
    const tvShows = json.results.map((tvShow) => ({
      title: tvShow.name,
      id: tvShow.id,
      poster_path: tvShow.poster_path,
    }));

    cache.set("topRatedTvShows", tvShows);
    res.send(tvShows);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching tv shows data." });
  }
};

const searchForOneMovie = async (req, res) => {
  const query = req.params.id;
  const cacheKey = `movie_${query}`;
  try {
    const cached = cache.get(cacheKey);
    if (cached) return res.send(cached);

    const response = await fetch(
      `${url}movie/${query}?&append_to_response=credits,videos&api_key=${apikey}`,
      options,
    );
    const json = await response.json();

    cache.set(cacheKey, json, 1800); // 30 min TTL for individual movies
    res.send(json);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching movie data." });
  }
};

const searchForOneTvShow = async (req, res) => {
  const query = req.params.id;
  const cacheKey = `tvShow_${query}`;
  try {
    const cached = cache.get(cacheKey);
    if (cached) return res.send(cached);

    const response = await fetch(
      `${url}tv/${query}?&append_to_response=credits,videos&api_key=${apikey}`,
      options,
    );
    const json = await response.json();

    cache.set(cacheKey, json, 1800); // 30 min TTL for individual TV shows
    res.send(json);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching tv show data." });
  }
};

const getSimilarMovies = async (req, res) => {
  const movieId = req.params.id;
  const cacheKey = `similar_movie_${movieId}`;
  try {
    const cached = cache.get(cacheKey);
    if (cached) return res.send(cached);

    const response = await fetch(
      `${url}movie/${movieId}/recommendations?language=en-US&page=1&api_key=${apikey}`,
      options,
    );
    const json = await response.json();
    const movies = json.results
      .filter((m) => m.poster_path)
      .slice(0, 12)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      }));

    cache.set(cacheKey, movies, 1800);
    res.send(movies);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching similar movies." });
  }
};

const getSimilarTvShows = async (req, res) => {
  const tvShowId = req.params.id;
  const cacheKey = `similar_tvShow_${tvShowId}`;
  try {
    const cached = cache.get(cacheKey);
    if (cached) return res.send(cached);

    const response = await fetch(
      `${url}tv/${tvShowId}/recommendations?language=en-US&page=1&api_key=${apikey}`,
      options,
    );
    const json = await response.json();
    const tvShows = json.results
      .filter((s) => s.poster_path)
      .slice(0, 12)
      .map((show) => ({
        id: show.id,
        title: show.name,
        poster_path: show.poster_path,
        vote_average: show.vote_average,
      }));

    cache.set(cacheKey, tvShows, 1800);
    res.send(tvShows);
  } catch (err) {
    console.error("error:" + err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching similar TV shows." });
  }
};

module.exports = {
  searchForMoviesAndTvShows,
  searchForOneMovie,
  searchForOneTvShow,
  getPopularMovies,
  getPopularTvShows,
  getTopRatedMovies,
  getTopRatedTvShows,
  getSimilarMovies,
  getSimilarTvShows,
};
