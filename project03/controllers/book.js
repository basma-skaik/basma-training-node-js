const { dbConnection } = require("../configurations");
const { ObjectId } = require("bson");
const createError = require("http-errors");

const getBooks = (req, res, next) => {
  const pageNum = parseInt(req.query.page);

  if (isNaN(pageNum)) {
    res.status(400).json({
      status: false,
      message: "You should send a page number",
    });
  }

  const limit = 10;
  const skip = (pageNum - 1) * limit;

  dbConnection("books", async (collection) => {
    const books = await collection.find({}).limit(limit).skip(skip).toArray();
    res.json(books);
  });
};

const getBooksPageCount = (req, res, next) => {
  dbConnection("books", async (collection) => {
    const limit = 10;
    const count = await collection.count({});
    const page = Math.ceil(count / limit);
    res.status(200).json({
      page: page,
    });
  });
};

const getBookById = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    const error = createError(400, "id is not valid");
    next(error);
  }
  const _id = new ObjectId(req.params.id);
  dbConnection("books", async (collection) => {
    try {
      const book = await collection.findOne({ _id });

      if (!book) {
        const error = createError(404, "resource not found");
        next(error);
      }

      res.status(200).json({
        status: true,
        book: book,
      });
    } catch (err) {
      const error = createError(500, err.message);
      next(error);
    }
  });
};

module.exports = {
  getBooks,
  getBooksPageCount,
  getBookById,
};
