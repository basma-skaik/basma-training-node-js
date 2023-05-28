const express = require("express");
const createError = require("http-errors");

const { returnJson } = require("./my_modules/json_response");
global.returnJson = returnJson;

const routes = require("./routes");
const middleware = require("./middleware");

const app = express();

process.on("unhandledRejection", (reason) => {
  console.log(reason);
  process.exit(1);
});

//there is a problem when  we send the req
//cannot set headers after they are sent to the client
//لما ابعت الريكويست لحال ع الهوم و احط الlang بروح عادي بس لما يكزن مسار تاني غير الهوم برضاش
middleware.global(app);

routes(app);

//not found handler
app.use((req, res, next) => {
  const error = createError(404);
  next(error);
});

//error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode).json({
    status: false,
    message: error.message,
  });

  // return returnJson(res, error.statusCode, false, error.message, null);
});

module.exports = app;
