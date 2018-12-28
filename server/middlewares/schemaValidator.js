import Joi from 'joi';
import Schemas from '../data/schemas';
import { isBoolean, hasProp, getProp } from '../utils';

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

    const _supportedMethods = ['post', 'patch'];

    if (_supportedMethods.includes(method) && hasProp(Schemas, path)) {
      const _schema = getProp(Schemas, path);

      if (_schema) {
        return Joi.validate(req.body, _schema, _validationOptions, (err, data) => {
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


            let errorMsg = ' ';

            details.forEach((detail) => {
              errorMsg += detail.message;
              errorMsg += ', ';
            });

            const CustomError = {
              status: 422,
              error: `Invalid request data: ${errorMsg} please review request and try again.`
            };
            res.status(422).send(_useJoiError ? JoiError : CustomError);
          } else {
            req.body = data;
            next();
          }
        });
      }
    }
  };
};
