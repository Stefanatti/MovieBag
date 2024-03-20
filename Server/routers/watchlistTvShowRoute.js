const watchlistTvShowController = require("../controllers/watchlistTvShowController");
const router = require("express").Router();

router.get("/:id", watchlistTvShowController.getWatchlistTvShows);
router.post("/", watchlistTvShowController.addWatchlistTvShow);
router.delete("/:id", watchlistTvShowController.deleteWatchlistTvShow);

module.exports = router;
