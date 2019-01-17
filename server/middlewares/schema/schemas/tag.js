import Joi from 'joi';

const tagDataSchema = Joi.object().keys({
  tags: Joi.array().required()
});

export default tagDataSchema;
