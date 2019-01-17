import Joi from 'joi';

const imageDataSchema = Joi.object().keys({
  meetupPhotos: Joi.binary().required()
});

export default imageDataSchema;
