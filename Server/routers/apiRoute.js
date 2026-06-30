const apiController = require("../controllers/apiController");
const router = require("express").Router();

router.get("/popular", apiController.getPopularMovies);
router.get("/top_rated", apiController.getTopRatedMovies);

router.get("/tv/popular", apiController.getPopularTvShows);
router.get("/tv/top_rated", apiController.getTopRatedTvShows);

router.get("/:search", apiController.searchForMoviesAndTvShows);
router.get("/id/:id", apiController.searchForOneMovie);
router.get("/id/:id/similar", apiController.getSimilarMovies);
router.get("/tv/id/:id", apiController.searchForOneTvShow);
router.get("/tv/id/:id/similar", apiController.getSimilarTvShows);

module.exports = router;
