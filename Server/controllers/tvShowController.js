const TvShow = require("../modules/tvShowModule");
//const fetch = import("node-fetch");

const getTvShow = async (req, res) => {
  try {
    let tvShows = await TvShow.find({ owner: req.params.id }).populate("owner");
    res.send(tvShows);
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
};

const addTvShow = (req, res) => {
  let newTvShow = new TvShow(req.body);
  newTvShow.save();
  res.send({ message: "inserted " });
};

const deleteTvShow = async (req, res) => {
  await TvShow.deleteOne({ id: req.params.id });
  res.send({ message: "TvShow deleted" });
};

const watchTvShow = async (req, res) => {
  const tvShow = await TvShow.findOne({ _id: req.params.id });
  tvShow.watched = !tvShow.watched;
  tvShow.save();
  res.send(tvShow);
};

module.exports = {
  getTvShow,
  addTvShow,
  deleteTvShow,
  watchTvShow,
  //fetchTvShows,
};
