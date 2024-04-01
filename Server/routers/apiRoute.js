const apiController = require("../controllers/apiController");
const router = require("express").Router();

router.get("/:search", apiController.searchForMoviesAndTvShows);
router.get("/id/:id", apiController.searchForOneMovie);
router.get("/tv/id/:id", apiController.searchForOneTvShow);

module.exports = router;
