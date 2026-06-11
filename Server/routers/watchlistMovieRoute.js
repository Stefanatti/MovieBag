const watchlistMovieController = require("../controllers/watchlistMovieController");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

router.get("/:id", authMiddleware, watchlistMovieController.getWatchlistMovies);
router.post("/", authMiddleware, watchlistMovieController.addWatchlistMovie);
router.delete(
  "/:id",
  authMiddleware,
  watchlistMovieController.deleteWatchlistMovie,
);

module.exports = router;
