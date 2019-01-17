import Joi from 'joi';
import Schemas from './schemas';
import { isBoolean, hasProp, getProp } from '../../utils';

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

            const makeCustomError = (msg) => {
              if (msg.search('required') > -1) {
                return {
                  status: 400,
                  error: errorMsg
                };
              }

              return {
                status: 422,
                error: errorMsg
              };
            };

            const customError = makeCustomError(errorMsg);

            res.status(422).send(_useJoiError ? JoiError : customError);
          } else {
            req.body = data;
            next();
          }
        });
      }
    }
  };
};
