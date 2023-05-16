const { Router } = require("express");

const { reviewresController } = require("../controllers");

const router = Router();

router
  .get("/", reviewresController.getReviewres)
  .get("/pages", reviewresController.getReviewresPageCount)
  .get("/:id", reviewresController.getReviewerById);

module.exports = router;
