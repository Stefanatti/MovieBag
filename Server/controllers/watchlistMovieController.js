const WatchlistMovie = require("../modules/watchlistMovieModule");

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
        .send({ message: "Movie already exists in your watchlist." });
    } else {
      let newWatchlistMovie = new WatchlistMovie(req.body);
      await newWatchlistMovie.save();
      res.send({ message: "Movie added to watchlist" });
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

module.exports = {
  getWatchlistMovies,
  addWatchlistMovie,
  deleteWatchlistMovie,
};
