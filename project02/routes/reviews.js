const { Router } = require("express");

const { reviewsController } = require("../controllers");

const router = Router();

router
  .get("/", reviewsController.getReviews)
  .get("/pages", reviewsController.getReviewsPageCount)
  .get("/:id", reviewsController.getReviewById);

module.exports = router;
