require("dotenv").config({ path: ".env" });

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// const url = `${process.env.API_URL}/?apikey=${process.env.API_KEY}`;
const url = "https://api.themoviedb.org/3/";
const apikey = "59f83dbb2b6e7e5393bfbfd3ca454401";
const options = {
  method: "GET",
};

const searchForMoviesAndTvShows = (req, res) => {
  const query = req.params.search;
  fetch(
    `${url}search/multi?query=${query}&sort_by=popularity.desc&api_key=${apikey}`,
    options
  )
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((err) => console.error("error:" + err));
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

// const searchForMovies = (req, res) => {
//   const query = req.params.search;
//   fetch(`${url}&s=${query}`, options)
//     .then((res) => res.json())
//     .then((json) => res.send(json))
//     .catch((err) => console.error("error:" + err));
// };

// const searchForOneMovie = (req, res) => {
//   const query = req.params.id;
//   fetch(
//     `${url}movie/${query}?&append_to_response=credits&api_key=${apikey}`,
//     options
//   )
//     .then((res) => res.json())
//     .then((json) => res.send(json))
//     .catch((err) => console.error("error:" + err));
// };

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
};
