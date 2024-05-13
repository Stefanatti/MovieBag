require("dotenv").config({ path: ".env" });

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const url = process.env.API_URL;
const apikey = process.env.API_KEY;
const ratingsUrl = process.env.RATINGS_API_URL;
const ratingsApiKey = process.env.RATINGS_API_KEY;
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

const getTopRatedMovies = async (req, res) => {
  try {
    const response = await fetch(
      `${url}movie/top_rated?language=en-US&page=1&api_key=${apikey}`,
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

const getPopularTvShows = async (req, res) => {
  try {
    const response = await fetch(
      `${url}discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=US&with_genres=10759%7C80%7C18%7C9648%7C10765&with_origin_country=US&api_key=${apikey}`,
      options
    );
    const json = await response.json();
    const tvShows = json.results.map((tvShow) => ({
      title: tvShow.name,
      id: tvShow.id,
      poster_path: tvShow.poster_path,
    }));
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
    const response = await fetch(
      `${url}tv/top_rated?language=en-US&page=1&api_key=${apikey}`,
      options
    );
    const json = await response.json();
    const tvShows = json.results.map((tvShow) => ({
      title: tvShow.name,
      id: tvShow.id,
      poster_path: tvShow.poster_path,
    }));
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

// const getShowsRatings = async (req, res) => {
//   const query = req.params.title;
//   try {
//     const response = await fetch(
//       `${ratingsUrl}?t=${query}&apikey=${ratingsApiKey}`,
//       options
//     );
//     const json = await response.json();
//     res.send(json);
//   } catch (err) {
//     console.error("error:" + err);
//     res
//       .status(500)
//       .send({ error: "An error occurred while fetching movie data." });
//   }
// };

module.exports = {
  searchForMoviesAndTvShows,
  searchForOneMovie,
  searchForOneTvShow,
  getPopularMovies,
  getPopularTvShows,
  getTopRatedMovies,
  getTopRatedTvShows,
  // getShowsRatings,
};
