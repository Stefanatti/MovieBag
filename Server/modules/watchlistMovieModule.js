const mongoose = require("./connection");

const WatchlistMovieSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: String },
  type: { type: String },
  director: { type: String },
  poster: { type: String },
  plot: { type: String },

  date_added: {
    type: Date,
    default: Date.now(),
  },
  watched: {
    type: Boolean,
    default: false,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const WatchlistMovie = mongoose.model("WatchlistMovie", WatchlistMovieSchema);

module.exports = WatchlistMovie;
