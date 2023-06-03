const express = require("express");
const middlewares = require("./middlewares");
const routers = require("./routes");
const createError = require("http-errors");

const app = express();

process.on("unhandledRejection", (reason) => {
  console.log(reason);
  process.exit(1);
});

middlewares(app);

routers(app);

//Not Found Handler
app.use((req, res, next) => {
  const error = createError(404);
  next(error);
});

//Error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode).json({
    status: false,
    message: error.message,
  });
});

module.exports = app;
