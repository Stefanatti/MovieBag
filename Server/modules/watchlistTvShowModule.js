const mongoose = require("./connection");

const WatchlistTvShowSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  year: { type: String },
  type: { type: String },
  creator: { type: String },
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

const WatchlistTvShow = mongoose.model(
  "WatchlistTvShow",
  WatchlistTvShowSchema
);

module.exports = WatchlistTvShow;
