const Joi = require('joi');

export default {
  getUserDataSchema(type) {
    if (type === 'sign-up') {
      return Joi.object().keys({
        email: Joi.string().email().strict().required(),
        password: Joi.string().min(8).required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required()
      });
    }
    return Joi.object().keys({
      email: Joi.string().email().strict().required(),
      password: Joi.string().min(8).required()
    });
  }
};
