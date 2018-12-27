const Joi = require('joi');

const rsvpDataSchema = Joi.object().keys({
  title: Joi.string().strict().required(),
  body: Joi.string().required()
});

export default rsvpDataSchema;
