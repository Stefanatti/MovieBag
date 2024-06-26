const mongoose = require("../modules/connection");

const MovieSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: String },
  type: { type: String },
  director: { type: String },
  date_added: {
    type: Date,
    default: Date.now(),
  },
  watched: {
    type: Boolean,
    default: false,
  },
  ratings: {
    stars: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
      //required: true,
    },
  },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
