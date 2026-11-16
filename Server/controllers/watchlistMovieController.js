const WatchlistMovie = require("../modules/watchlistMovieModule");
const Movie = require("../modules/movieModule");
const markWatched = require("./markWatched");

const getWatchlistMovies = async (req, res) => {
  try {
    let watchlistMovies = await WatchlistMovie.find({
      owner: req.params.id,
    }).populate("owner");
    res.send(watchlistMovies);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const addWatchlistMovie = async (req, res) => {
  try {
    const watchlistMovieExists = await WatchlistMovie.exists({
      id: req.body.id,
      owner: req.body.owner,
    });
    if (watchlistMovieExists) {
      res
        .status(400)
        .send({ message: "This movie is already in your watchlist." });
    } else {
      let newWatchlistMovie = new WatchlistMovie(req.body);
      await newWatchlistMovie.save();
      res.send({ message: "Movie added to your watchlist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const deleteWatchlistMovie = async (req, res) => {
  try {
    const result = await WatchlistMovie.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Movie not found in watchlist" });
    }
    res.send({ message: "Movie deleted from watchlist" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const markWatchlistMovieWatched = markWatched({
  Watchlist: WatchlistMovie,
  Library: Movie,
  fields: ["id", "title", "year", "type", "director", "poster"],
  label: "Movie",
});

module.exports = {
  getWatchlistMovies,
  addWatchlistMovie,
  deleteWatchlistMovie,
  markWatchlistMovieWatched,
};
