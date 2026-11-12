const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tmdbId: { type: String, required: true },
    mediaType: { type: String, enum: ["movie", "tv"], required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    containsSpoilers: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ReviewSchema.index({ author: 1, tmdbId: 1, mediaType: 1 }, { unique: true });
ReviewSchema.index({ mediaType: 1, tmdbId: 1, createdAt: -1, _id: -1 });

module.exports = mongoose.model("Review", ReviewSchema);
