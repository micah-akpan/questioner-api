import Joi from 'joi';

const meetupDataSchema = Joi.object().keys({
  topic: Joi.string().strict().required(),
  happeningOn: Joi.date().min('now').required(),
  location: Joi.string().required(),
  tags: Joi.any(),
  images: Joi.array()
});

export default meetupDataSchema;
