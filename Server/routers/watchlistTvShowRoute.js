const watchlistTvShowController = require("../controllers/watchlistTvShowController");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

router.get(
  "/:id",
  authMiddleware,
  watchlistTvShowController.getWatchlistTvShows,
);
router.post("/", authMiddleware, watchlistTvShowController.addWatchlistTvShow);
router.delete(
  "/:id",
  authMiddleware,
  watchlistTvShowController.deleteWatchlistTvShow,
);

module.exports = router;
