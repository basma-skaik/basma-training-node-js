const Joi = require("@hapi/joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().max(10).min(4).required(),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$")
    )
    .message("The Password does not match our password rules")
    .required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  schema,
  loginSchema,
};
