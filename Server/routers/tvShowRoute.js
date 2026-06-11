const tvShowController = require("../controllers/tvShowController");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

router.get("/:id", authMiddleware, tvShowController.getTvShow);
router.post("/", authMiddleware, tvShowController.addTvShow);
router.delete("/:id", authMiddleware, tvShowController.deleteTvShow);
router.put("/rate/:id", authMiddleware, tvShowController.rateTvShow);

module.exports = router;
