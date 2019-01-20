const Joi = require('joi');

const commentDataSchema = Joi.object().keys({
  comment: Joi.string().min(3).required(),
  questionId: Joi.number().integer().required()
});

export default commentDataSchema;
