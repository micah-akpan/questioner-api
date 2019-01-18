import Joi from 'joi';

const meetupDataSchema = Joi.object().keys({
  topic: Joi.string().strict().required(),
  happeningOn: Joi.date().required().min('now'),
  location: Joi.string().required(),
  tags: Joi.array(),
  images: Joi.array()
});

export default meetupDataSchema;
