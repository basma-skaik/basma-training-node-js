const bookRouter = require("./book");

module.exports = (app) => {
  app.get("/", (req, res, next) => {
    res.statuse(200).json({
      statuse: true,
      message: null,
    });
  });

  app.use("/books", bookRouter);
};
