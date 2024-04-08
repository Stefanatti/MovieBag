const apiController = require("../controllers/apiController");
const router = require("express").Router();

router.get("/popular", apiController.getPopularMovies);
router.get("/toprated", apiController.getTopRatedMovies);

router.get("/tv/popular", apiController.getPopularTvShows);
router.get("/tv/toprated", apiController.getTopRatedTvShows);

router.get("/:search", apiController.searchForMoviesAndTvShows);
router.get("/id/:id", apiController.searchForOneMovie);
router.get("/tv/id/:id", apiController.searchForOneTvShow);

module.exports = router;
