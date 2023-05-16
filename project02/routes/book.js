const { Router } = require("express");

const { bookController } = require("../controllers");

const router = Router();

router
  .get("/", bookController.getBooks)
  .get("/pages", bookController.getBooksPageCount)
  .get("/:id", bookController.getBookById);

module.exports = router;
