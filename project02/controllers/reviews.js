const { dbConnection } = require("../configurations");
const { ObjectId } = require("bson");

const getReviews = (req, res, next) => {
  try {
    const pageNum = parseInt(req.query.page);

    if (isNaN(pageNum)) {
      res.status(400).json({
        status: false,
        message: "You should sent page number",
      });
    }

    const limit = 10;

    const skip = (pageNum - 1) * 10;

    dbConnection("reviews", async (collection) => {
      const reviews = await collection
        .find({})
        .limit(limit)
        .skip(skip)
        .toArray();
      res.json(reviews);
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "something is wrong",
    });
  }
};

const getReviewsPageCount = (req, res, next) => {
  try {
    dbConnection("reviews", async (collection) => {
      const limit = 10;
      const count = await collection.count({});
      const pages = Math.ceil(count / limit);

      res.json({
        pages: pages,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "something is wrong",
    });
  }
};

const getReviewById = (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({
        status: false,
        message: "id is not valid",
      });
    }

    const _id = new ObjectId(req.params.id);

    dbConnection("reviews", async (collection) => {
      const review = await collection.findOne({ _id });

      if (!review) {
        res.status(400).json({
          status: false,
          message: "resource not found",
        });
      }

      res.json(review);
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "something is wrong",
    });
  }
};

module.exports = {
  getReviews,
  getReviewsPageCount,
  getReviewById,
};
