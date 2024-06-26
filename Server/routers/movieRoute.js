const movieController = require("../controllers/movieController");
const router = require("express").Router();

router.get("/:id", movieController.getMovie);
router.post("/", movieController.addMovie);
router.delete("/:id", movieController.deleteMovie);
router.put("/rate/:id", movieController.rateMovie);

module.exports = router;
