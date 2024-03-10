require("dotenv").config({ path: ".env" });

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// const url = `${process.env.API_URL}/?apikey=${process.env.API_KEY}`;
const url = "https://api.themoviedb.org/3/";
const apikey = "&api_key=59f83dbb2b6e7e5393bfbfd3ca454401";
const options = {
  method: "GET",
};

const searchForMovies = (req, res) => {
  const query = req.params.search;
  fetch(`${url}search/movie?query=${query}${apikey}`, options)
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((err) => console.error("error:" + err));
};

// const searchForMovies = (req, res) => {
//   const query = req.params.search;
//   fetch(`${url}&s=${query}`, options)
//     .then((res) => res.json())
//     .then((json) => res.send(json))
//     .catch((err) => console.error("error:" + err));
// };

const searchForOneMovie = (req, res) => {
  const query = req.params.id;
  fetch(`${url}movie/${query}?&append_to_response=credits${apikey}`, options)
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((err) => console.error("error:" + err));
};

// const searchForOneMovie = (req, res) => {
//   const query = req.params.title;
//   fetch(`${url}&t=${query}`, options)
//     .then((res) => res.json())
//     .then((json) => res.send(json))
//     .catch((err) => console.error("error:" + err));
// };

module.exports = {
  searchForMovies,
  searchForOneMovie,
};
