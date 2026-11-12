const router = require("express").Router();
const auth = require("../middleware/auth");
const reviews = require("../controllers/reviewController");

router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

router.get("/mine", auth, reviews.getMyReviews);
router.get("/mine/:mediaType/:tmdbId", auth, reviews.validateTitle, reviews.getMyReview);
router.get("/:mediaType/:tmdbId", reviews.validateTitle, reviews.getReviews);
router.post("/:mediaType/:tmdbId", auth, reviews.validateTitle, reviews.validateBody, reviews.createReview);
router.patch("/:reviewId", auth, reviews.validateReviewId, reviews.validateBody, reviews.updateReview);
router.delete("/:reviewId", auth, reviews.validateReviewId, reviews.deleteReview);

module.exports = router;
