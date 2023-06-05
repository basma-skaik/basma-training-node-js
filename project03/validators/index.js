const { schema, loginSchema, reviewSchema } = require("./user");

module.exports = {
  userValidator: schema,
  loginValidator: loginSchema,
  reviewValidator: reviewSchema,
};
