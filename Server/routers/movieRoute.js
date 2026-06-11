const movieController = require("../controllers/movieController");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

router.get("/:id", authMiddleware, movieController.getMovie);
router.post("/", authMiddleware, movieController.addMovie);
router.delete("/:id", authMiddleware, movieController.deleteMovie);
router.put("/rate/:id", authMiddleware, movieController.rateMovie);

module.exports = router;
