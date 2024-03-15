const tvShowController = require("../controllers/tvShowController");
const router = require("express").Router();

router.get("/:id", tvShowController.getTvShow);
router.post("/", tvShowController.addTvShow);
router.delete("/:id", tvShowController.deleteTvShow);
router.put("/watched/:id", tvShowController.watchTvShow);

module.exports = router;
