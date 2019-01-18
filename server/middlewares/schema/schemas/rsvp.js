const Joi = require('joi');

const rsvpDataSchema = Joi.object().keys({
  userId: Joi.number().integer(),
  response: Joi.string().allow(['yes', 'no', 'maybe']).strict().required(),
});

export default rsvpDataSchema;
