const Joi = require('joi');

export default {
  getUserDataSchema(type) {
    if (type === 'sign-up') {
      return Joi.object().keys({
        email: Joi.string().strict().required(),
        password: Joi.string().min(7).required(),
        firstname: Joi.string().required(),
        lastname: Joi.string()
      });
    }
    return Joi.object().keys({
      email: Joi.string().strict().required(),
      password: Joi.string().min(7).required().trim(),
    });
  }
};
