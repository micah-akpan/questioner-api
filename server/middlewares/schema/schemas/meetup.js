import Joi from 'joi';

const meetupDataSchema = Joi.object().keys({
  topic: Joi.string().strict(),
  happeningOn: Joi.date().min('now'),
  location: Joi.string(),
  tags: Joi.array(),
  images: Joi.array()
});

export default meetupDataSchema;
