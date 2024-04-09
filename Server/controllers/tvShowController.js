const TvShow = require("../modules/tvShowModule");

const getTvShow = async (req, res) => {
  try {
    let tvShows = await TvShow.find({ owner: req.params.id }).populate("owner");
    res.send(tvShows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const addTvShow = async (req, res) => {
  try {
    const tvShowExists = await TvShow.exists({
      id: req.body.id,
      owner: req.body.owner,
    });
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
  try {
    const result = await TvShow.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Tv Show not found" });
    }
    res.send({ message: "Tv Show deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Something went wrong" });
  }
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

// const watchTvShow = async (req, res) => {
//   const tvShow = await TvShow.findOne({ _id: req.params.id });
//   tvShow.watched = !tvShow.watched;
//   tvShow.save();
//   res.send(tvShow);
// };

module.exports = {
  getTvShow,
  addTvShow,
  deleteTvShow,
  //watchTvShow,
  rateTvShow,
};
