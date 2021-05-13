import Joi from 'joi';
import schemas from './schemas';
import { isBoolean, hasProp } from '../../utils';

export default (useJoiError = false) => {
  const _useJoiError = isBoolean(useJoiError) && useJoiError;

  const _validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  };

  return (req, res, next) => {
    const { path } = req.route;
    const method = req.method.toLowerCase();

    const _supportedMethods = ['post', 'patch', 'put'];

    if (_supportedMethods.includes(method) && hasProp(schemas, path)) {
      const schema = schemas[path];

      if (schema) {
        return Joi.validate(req.body, schema, _validationOptions, (err, data) => {
          if (err) {
            const JoiError = {
              status: 422,
              error: {
                original: err._object,
                details: err.details.map(({ message, type }) => ({
                  message: message.replace(/['"]/g, ''),
                  type
                }))
              }
            };

            const details = err.details.map(({ message }) => ({
              message: message.replace(/['"]/g, ''),
            }));

            let errorMsg = '';

            // Forms a user friendly validation error
            // message
            details.forEach((detail, i) => {
              errorMsg += detail.message;
              if (i === details.length - 2) {
                errorMsg += ' and ';
              } else if (i === details.length - 1) {
                errorMsg += '';
              } else {
                errorMsg += ', ';
              }
            });

            errorMsg = errorMsg.trim();

            /**
             * @func makeCustomError
             * @param {String} msg The Error msg
             * @returns {*} custom error
             * @description Returns a
             * custom Error based
             * on a substring found in the error
             * message: `msg`
             */
            const makeCustomError = msg => ({
              status: 400,
              error: msg
            });

            const customError = makeCustomError(errorMsg);
            return res.status(customError.status).send(_useJoiError ? JoiError : customError);
          }
          req.body = data;
          next();
        });
      }
    }
  };
};
