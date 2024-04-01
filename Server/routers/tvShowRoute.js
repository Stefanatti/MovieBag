const tvShowController = require("../controllers/tvShowController");
const router = require("express").Router();

router.get("/:id", tvShowController.getTvShow);
router.post("/", tvShowController.addTvShow);
router.delete("/:id", tvShowController.deleteTvShow);
router.put("/watched/:id", tvShowController.watchTvShow);
router.put("/rate/:id", tvShowController.rateTvShow);

module.exports = router;
