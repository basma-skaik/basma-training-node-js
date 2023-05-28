const { dbConnection } = require("../configurations");
const { ObjectId } = require("bson");
const createError = require("http-errors");

const getBooks = (req, res, next) => {
  try {
    const pageNum = parseInt(req.query.page);

    if (isNaN(pageNum)) {
      const error = createError(400, "You should send a page number");
      next(error);
    }

    const limit = 10;

    /*
    page  limit   skip
    1       10      0
    2       10      10
    3       10      20
  */

    const skip = (pageNum - 1) * 10;

    dbConnection("books", async (collection) => {
      const books = await collection.find({}).limit(limit).skip(skip).toArray();
      // res.json(books);
      return returnJson(res, 200, true, "", books);
    });
  } catch (err) {
    const error = createError(500, error.message);
    next(error);
  }
};

const getBooksPageCount = (req, res, next) => {
  try {
    dbConnection("books", async (collection) => {
      const limit = 10;
      const count = await collection.count({});
      const pages = Math.ceil(count / limit);

      res.json({
        pages: pages,
      });
    });
  } catch (err) {
    const error = createError(500, error.message);
    next(error);
  }
};

const getBookById = (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      const error = createError(400, "id is not valid");
      next(error);
    }
    const _id = new ObjectId(req.params.id);

    dbConnection("books", async (collection) => {
      const book = await collection.findOne({ _id: _id });

      if (!book) {
        const error = createError(404, "resource is not found!");
        next(error);
      }

      res.json(book);
    });
  } catch (err) {
    const error = createError(500, error.message);
    next(error);
  }
};

module.exports = {
  getBooks,
  getBooksPageCount,
  getBookById,
};
