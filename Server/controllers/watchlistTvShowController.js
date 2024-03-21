const WatchlistTvShow = require("../modules/watchlistTvShowModule");
//const fetch = import("node-fetch");

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

const addWatchlistTvShow = (req, res) => {
  let newWatchlistTvShow = new WatchlistTvShow(req.body);
  newWatchlistTvShow.save();
  res.send({ message: "New Tv Show inserted in Watchlist " });
};

const deleteWatchlistTvShow = async (req, res) => {
  await WatchlistTvShow.deleteOne({ _id: req.params.id });
  res.send({ message: "TvShow deleted from Watchlist" });
};

module.exports = {
  getWatchlistTvShows,
  addWatchlistTvShow,
  deleteWatchlistTvShow,
};
