const Movie = require("../modules/movieModule");
//const WatchlistMovie = require("../modules/watchlistMovieModule");
//const fetch = import("node-fetch");

const getMovie = async (req, res) => {
  try {
    let movies = await Movie.find({ owner: req.params.id }).populate("owner");
    res.send(movies);
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
};

const addMovie = async (req, res) => {
  try {
    const movieExists = await Movie.exists({ title: req.body.title });
    //const movieExistsInWatchlist = await WatchlistMovie.exists({ title: req.body.title });

    if (movieExists) {
      res.status(400).send({ message: "Movie already exists in your list." });
    } else {
      let newMovie = new Movie(req.body);
      await newMovie.save();
      res.send({ message: "Movie added to list" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const deleteMovie = async (req, res) => {
  await Movie.deleteOne({ _id: req.params.id });
  res.send({ message: "Movie deleted" });
};

const watchMovie = async (req, res) => {
  const movie = await Movie.findOne({ _id: req.params.id });
  movie.watched = !movie.watched;
  movie.save();
  res.send(movie);
};

// const rateMovie = async (req, res) => {
//   try {
//     const { userId, stars } = req.body;

//     // Find the movie and update its ratings array
//     const movie = await Movie.findById(req.params.id);
//     if (!movie) {
//       return res.status(404).send({ message: "Movie not found" });
//     } else console.log(req.body, movie.title, movie.owner);
//     // Check if the user has already rated this movie
//     // const existingRating = movie.ratings.find(
//     //   (rating) => rating._id.toString() === userId
//     // );
//     // console.log(existingRating);
//     // if (existingRating) {
//     //   return res
//     //     .status(400)
//     //     .send({ message: "You have already rated this movie" });
//     // }

//     // Add the new rating
//     movie.ratings.push({ stars: stars });
//     await movie.save();

//     res.send({ message: "Movie rated successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ message: "Something went wrong" });
//   }
// };

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

// app.post('/api/products/:id/review', async (req, res) => {
//   const { user, rating, comment } = req.body;

//   try {
//       const product =
//           await Product.findById(req.params.id);
//       product.reviews
//           .push(
//               {
//                   user, rating,
//                   comment
//               }
//           );
//       await product.save();
//       res.status(201).json(product);
//   } catch (error) {
//       res.status(400).json({ message: error.message });
//   }
// });

module.exports = {
  getMovie,
  addMovie,
  deleteMovie,
  watchMovie,
  rateMovie,
  //fetchMovies,
};
