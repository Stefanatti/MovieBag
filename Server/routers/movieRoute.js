const movieController = require("../controllers/movieController");
const router = require("express").Router();

router.get("/:id", movieController.getMovie);
router.post("/", movieController.addMovie);
router.delete("/:id", movieController.deleteMovie);
router.put("/watched/:id", movieController.watchMovie);
router.post("/watchlist/", movieController.addWatchlist);

module.exports = router;
