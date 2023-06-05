const { Router } = require("express");
const { bookController } = require("../controllers");
const router = Router();
const { auth } = require("../middlewares");

router
  .get("/", auth, bookController.getBooks)
  .get("/pages", bookController.getBooksPageCount)
  .get("/:id", bookController.getBookById);

module.exports = router;
