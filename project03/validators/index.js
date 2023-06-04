const { schema, loginSchema } = require("./user");

module.exports = {
  userValidator: schema,
  loginValidator: loginSchema,
};
