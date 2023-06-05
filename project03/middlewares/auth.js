const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { readFileSync } = require("fs");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return next(createError(401));
  }

  const token = authHeader.split(" ")[1];
  const seretKey = readFileSync("./configurations/private.key");

  try {
    const decode = jwt.verify(token, seretKey);
    req._user_id = decode._id;
    req._reviewer_id = decode._reviewer_id;
    return next();
  } catch (error) {
    return next(createError(401));
  }
};
