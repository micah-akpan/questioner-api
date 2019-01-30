import Joi from 'joi';

const imageDataSchema = Joi.object().keys({
  meetupPhotos: Joi.array().required()
});

export default imageDataSchema;
