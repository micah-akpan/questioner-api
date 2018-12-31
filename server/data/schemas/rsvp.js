const Joi = require('joi');

const rsvpDataSchema = Joi.object().keys({
  userId: Joi.number().integer().required(),
  response: Joi.string().allow(['yes', 'no', 'maybe']).strict().required(),
});

export default rsvpDataSchema;
