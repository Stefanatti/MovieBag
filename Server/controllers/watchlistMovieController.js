const WatchlistMovie = require("../modules/watchlistMovieModule");

const getWatchlistMovies = async (req, res) => {
  try {
    let watchlistMovies = await WatchlistMovie.find({
      owner: req.params.id,
    }).populate("owner");
    res.send(watchlistMovies);
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
};

const addWatchlistMovie = (req, res) => {
  let newWatchlistMovie = new WatchlistMovie(req.body);
  newWatchlistMovie.save();
  res.send({ message: "Movie Inserted in watchlist " });
};

const deleteWatchlistMovie = async (req, res) => {
  await WatchlistMovie.deleteOne({ _id: req.params.id });
  res.send({ message: "WatchlistMovie deleted" });
};

module.exports = {
  getWatchlistMovies,
  addWatchlistMovie,
  deleteWatchlistMovie,
};
