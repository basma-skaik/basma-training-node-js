const Joi = require("@hapi/joi");

const schema = Joi.object({
  _book_id: Joi.string().required(),
  _reviewer_id: Joi.string().required(),
  rating: Joi.string().required(),
  comment: Joi.number.required(),
});

module.exports = { reviewSchema };
