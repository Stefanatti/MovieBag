const mongoose = require("./connection");

const TvShowSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  year: { type: String },
  type: { type: String },
  creator: { type: String },
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

const TvShow = mongoose.model("TvShow", TvShowSchema);

module.exports = TvShow;
