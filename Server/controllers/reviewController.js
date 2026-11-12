const Review = require("../modules/reviewModule");
const User = require("../modules/userModule");

const publicAuthor = { path: "author", select: "username" };

const serializeReview = (review) => ({
  _id: review._id,
  author: review.author
    ? { _id: review.author._id, username: review.author.username }
    : null,
  tmdbId: review.tmdbId,
  mediaType: review.mediaType,
  text: review.text,
  containsSpoilers: review.containsSpoilers,
  isPrivate: review.isPrivate === true,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

const validateTitle = (req, res, next) => {
  const { mediaType, tmdbId } = req.params;
  if (
    !["movie", "tv"].includes(mediaType) ||
    !/^[1-9]\d*$/.test(tmdbId) ||
    !Number.isSafeInteger(Number(tmdbId))
  ) {
    return res.status(400).send({ message: "Invalid movie or TV-show identifier." });
  }
  next();
};

const validateReviewId = (req, res, next) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.reviewId)) {
    return res.status(400).send({ message: "Invalid review identifier." });
  }
  next();
};

const validateBody = (req, res, next) => {
  const body = req.body;
  const isUpdate = req.method === "PATCH";
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).some((key) => !["text", "containsSpoilers", "isPrivate"].includes(key)) ||
    (isUpdate && Object.keys(body).length === 0)
  ) {
    return res.status(400).send({ message: "Provide review text and optional spoiler and privacy flags only." });
  }
  if (
    (!isUpdate || body.text !== undefined) &&
    (typeof body.text !== "string" ||
      !body.text.trim() ||
      body.text.trim().length > 2000)
  ) {
    return res.status(400).send({ message: "Review text must contain 1 to 2,000 characters." });
  }
  if (body.containsSpoilers !== undefined && typeof body.containsSpoilers !== "boolean") {
    return res.status(400).send({ message: "The spoiler flag must be true or false." });
  }
  if (body.isPrivate !== undefined && typeof body.isPrivate !== "boolean") {
    return res.status(400).send({ message: "The privacy flag must be true or false." });
  }
  req.reviewChanges = {};
  if (body.text !== undefined) req.reviewChanges.text = body.text.trim();
  if (body.containsSpoilers !== undefined) {
    req.reviewChanges.containsSpoilers = body.containsSpoilers;
  }
  if (body.isPrivate !== undefined) req.reviewChanges.isPrivate = body.isPrivate;
  next();
};

const handleError = (res, err) => {
  if (err.code === 11000) {
    return res.status(409).send({ message: "You have already reviewed this title. Edit your existing review instead." });
  }
  if (err.name === "ValidationError") {
    return res.status(400).send({ message: "Invalid review. Check the text and spoiler flag." });
  }
  console.error("Review request failed:", err);
  return res.status(500).send({ message: "Unable to process reviews. Please try again later." });
};

const listReviews = async (req, res, filter) => {
  const rawPage = req.query.page === undefined ? "1" : req.query.page;
  if (typeof rawPage !== "string" || !/^[1-9]\d*$/.test(rawPage) || !Number.isSafeInteger(Number(rawPage))) {
    return res.status(400).send({ message: "Page must be a positive integer." });
  }
  const page = Number(rawPage);
  const limit = 5;
  if (!Number.isSafeInteger((page - 1) * limit)) {
    return res.status(400).send({ message: "Page is too large." });
  }
  try {
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(publicAuthor)
        .lean(),
      Review.countDocuments(filter),
    ]);
    res.send({
      reviews: reviews.map(serializeReview),
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    handleError(res, err);
  }
};

const getReviews = (req, res) =>
  listReviews(req, res, {
    mediaType: req.params.mediaType,
    tmdbId: req.params.tmdbId,
    // Reviews written before privacy was introduced are public.
    $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }],
  });

const getMyReviews = (req, res) =>
  listReviews(req, res, { author: req.user.id });

const getMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      mediaType: req.params.mediaType,
      tmdbId: req.params.tmdbId,
      author: req.user.id,
    }).populate(publicAuthor).lean();
    res.send({ review: review ? serializeReview(review) : null });
  } catch (err) {
    handleError(res, err);
  }
};

const createReview = async (req, res) => {
  try {
    if (!(await User.exists({ _id: req.user.id }))) {
      return res.status(401).send({ message: "Your account is no longer available. Please log in again." });
    }
    const review = await Review.create({
      ...req.reviewChanges,
      author: req.user.id,
      mediaType: req.params.mediaType,
      tmdbId: req.params.tmdbId,
    });
    await review.populate(publicAuthor);
    res.status(201).send({
      message: review.isPrivate ? "Private review saved." : "Review published.",
      review: serializeReview(review),
    });
  } catch (err) {
    handleError(res, err);
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, author: req.user.id },
      { $set: req.reviewChanges },
      { new: true, runValidators: true },
    ).populate(publicAuthor).lean();
    if (!review) {
      return res.status(404).send({ message: "Review not found or not owned by you." });
    }
    res.send({ message: "Review updated.", review: serializeReview(review) });
  } catch (err) {
    handleError(res, err);
  }
};

const deleteReview = async (req, res) => {
  try {
    const result = await Review.deleteOne({ _id: req.params.reviewId, author: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Review not found or not owned by you." });
    }
    res.send({ message: "Review deleted." });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  validateTitle,
  validateReviewId,
  validateBody,
  getReviews,
  getMyReviews,
  getMyReview,
  createReview,
  updateReview,
  deleteReview,
};
