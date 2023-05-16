const { dbConnection } = require("../configurations");
const { ObjectId } = require("bson");

const getReviewres = (req, res, next) => {
  try {
    const pageNum = parseInt(req.query.page);

    if (isNaN(pageNum)) {
      res.status(400).json({
        status: false,
        message: "You should send a page number",
      });
    }

    const limit = 10;

    const skip = (pageNum - 1) * 10;

    dbConnection("reviewers", async (collection) => {
      const reviewres = await collection
        .find({})
        .limit(limit)
        .skip(skip)
        .toArray();
      res.json(reviewres);
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "something is wrong",
    });
  }
};

const getReviewresPageCount = (req, res, next) => {
  try {
    dbConnection("reviewers", async (collection) => {
      const limit = 10;
      const count = await collection.count({});
      const pages = Math.ceil(count / limit);

      res.json({
        status: true,
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

const getReviewerById = (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({
        status: false,
        message: "id is not valid",
      });
    }

    const _id = new ObjectId(req.params.id);

    dbConnection("reviewers", async (collection) => {
      const reviewer = await collection.findOne({ _id });

      if (!reviewer) {
        res.status(400).json({
          status: false,
          message: "recourse not found!",
        });
      }

      res.json(reviewer);
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "something is wrong",
    });
  }
};

module.exports = {
  getReviewres,
  getReviewresPageCount,
  getReviewerById,
};
