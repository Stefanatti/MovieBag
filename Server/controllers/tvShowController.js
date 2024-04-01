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

const addTvShow = async (req, res) => {
  try {
    const tvShowExists = await TvShow.exists({ title: req.body.name });
    if (tvShowExists) {
      res.status(400).send({ message: "TvShow already exists in your list." });
    } else {
      let newTvShow = new TvShow(req.body);
      await newTvShow.save();
      res.send({ message: "TvShow added to list" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const deleteTvShow = async (req, res) => {
  await TvShow.deleteOne({ _id: req.params.id });
  res.send({ message: "TvShow deleted" });
};

const watchTvShow = async (req, res) => {
  const tvShow = await TvShow.findOne({ _id: req.params.id });
  tvShow.watched = !tvShow.watched;
  tvShow.save();
  res.send(tvShow);
};

const rateTvShow = async (req, res) => {
  try {
    const { stars } = req.body;
    const tvShow = await TvShow.findOne({ _id: req.params.id });
    tvShow.ratings.stars = stars;
    if (stars < 0 || stars > 5) {
      return res
        .status(400)
        .send({ message: "Invalid stars value. Must be between 1 and 5." });
    } else {
      await tvShow.save();
      res.send(tvShow);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  getTvShow,
  addTvShow,
  deleteTvShow,
  watchTvShow,
  rateTvShow,
};
