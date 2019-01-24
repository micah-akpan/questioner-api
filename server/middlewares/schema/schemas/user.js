const Joi = require('joi');

export default {
  getUserDataSchema(type) {
    switch (type) {
      case 'sign-up': {
        return Joi.object().keys({
          email: Joi.string().email().strict().required(),
          password: Joi.string().min(8).required(),
          firstname: Joi.string().required(),
          lastname: Joi.string().required()
        });
      }

      case 'login': {
        return Joi.object().keys({
          email: Joi.string().email().strict().required(),
          password: Joi.string().min(8).required()
        });
      }

      case 'user-profile': {
        return Joi.object().keys({
          email: Joi.string().email(),
          password: Joi.string().min(8),
          firstname: Joi.string(),
          lastname: Joi.string(),
          username: Joi.string(),
          othername: Joi.string(),
          phonenumber: Joi.number().integer().max(15),
          bio: Joi.string(),
          birthday: Joi.date()
        });
      }

      default: {
        return Joi.any();
      }
    }
  },
};
