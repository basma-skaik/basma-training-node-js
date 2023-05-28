const { Router } = require("express");

const { bookController } = require("../controllers");

const router = Router();

const { auth } = require("../middleware");

router
  .get("/", auth, bookController.getBooks)
  .get("/pages", bookController.getBooksPageCount)
  .get("/:id", bookController.getBookById);

module.exports = router;
