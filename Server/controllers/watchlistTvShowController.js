const WatchlistTvShow = require("../modules/watchlistTvShowModule");

const getWatchlistTvShows = async (req, res) => {
  try {
    let watchlistTvShows = await WatchlistTvShow.find({
      owner: req.params.id,
    }).populate("owner");
    res.send(watchlistTvShows);
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
};

const addWatchlistTvShow = async (req, res) => {
  try {
    const watchlistTvShowExists = await WatchlistTvShow.exists({
      id: req.body.id,
      owner: req.body.owner,
    });
    if (watchlistTvShowExists) {
      res
        .status(400)
        .send({ message: "TvShow already exists in your watchlist." });
    } else {
      let newWatchlistTvShow = new WatchlistTvShow(req.body);
      await newWatchlistTvShow.save();
      res.send({ message: "TvShow added to watchlist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const deleteWatchlistTvShow = async (req, res) => {
  try {
    const result = await WatchlistTvShow.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "TvShow not found in watchlist" });
    }
    res.send({ message: "TvShow deleted from watchlist" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  getWatchlistTvShows,
  addWatchlistTvShow,
  deleteWatchlistTvShow,
};
