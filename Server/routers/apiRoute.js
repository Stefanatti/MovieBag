const apiController = require("../controllers/apiController");
const router = require("express").Router();

router.get("/:search", apiController.searchForMovies);
router.get("/id/:id", apiController.searchForOneMovie);

module.exports = router;
