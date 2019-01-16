const Joi = require('joi');

const userDataSchema = Joi.object().keys({
  email: Joi.string().strict().required(),
  password: Joi.string().min(7).required(),
  firstname: Joi.string().required(),
  lastname: Joi.string()
});

export default userDataSchema;
