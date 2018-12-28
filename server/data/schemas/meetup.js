import Joi from 'joi';

const meetupDataSchema = Joi.object().keys({
  topic: Joi.string().strict().required(),
  happeningOn: Joi.date().iso().required().min('now'),
  location: Joi.string().required(),
  tags: Joi.string(),
  images: Joi.array()
});

export default meetupDataSchema;
