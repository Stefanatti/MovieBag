const Movie = require("../modules/movieModule");

const getMovie = async (req, res) => {
  try {
    let movies = await Movie.find({ owner: req.params.id }).populate("owner");
    res.send(movies);
  } catch (err) {
    console.log(err);
    res.status(500).res.send("Something went wrong");
  }
};

const addMovie = async (req, res) => {
  try {
    const movieExists = await Movie.exists({
      id: req.body.id,
      owner: req.body.owner,
    });
    if (movieExists) {
      res.status(400).send({ message: "This movie is already in your list!" });
    } else {
      let newMovie = new Movie(req.body);
      await newMovie.save();
      res.send({ message: "Movie added to list" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Sorry, something went wrong, try again later.");
  }
};

const deleteMovie = async (req, res) => {
  try {
    const result = await Movie.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Movie not found" });
    }
    res.send({ message: "Movie deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const rateMovie = async (req, res) => {
  try {
    const { stars } = req.body;
    const movie = await Movie.findOne({ _id: req.params.id });
    movie.ratings.stars = stars;
    if (stars < 0 || stars > 5) {
      return res
        .status(400)
        .send({ message: "Invalid stars value. Must be between 1 and 5." });
    } else {
      await movie.save();
      res.send(movie);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  getMovie,
  addMovie,
  deleteMovie,
  rateMovie,
};
