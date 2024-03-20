const watchlistMovieController = require("../controllers/watchlistMovieController");
const router = require("express").Router();

router.get("/:id", watchlistMovieController.getWatchlistMovies);
router.post("/", watchlistMovieController.addWatchlistMovie);
router.delete("/:id", watchlistMovieController.deleteWatchlistMovie);

module.exports = router;
