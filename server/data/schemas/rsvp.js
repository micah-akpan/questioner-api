const Joi = require('joi');

const rsvpDataSchema = Joi.object().keys({
  userId: Joi.number().integer().required(),
  response: Joi.string().strict().required(),
});

export default rsvpDataSchema;
