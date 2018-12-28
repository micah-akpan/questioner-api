import Joi from 'joi';
import _ from 'lodash';
import Schemas from '../data/schemas';

export default (useJoiError = false) => {
  const _useJoiError = _.isBoolean(useJoiError) && useJoiError;

  const _validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  };

  return (req, res, next) => {
    const route = req.route.path;
    const method = req.method.toLowerCase();

    const _supportedMethods = ['post', 'patch'];

    if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
      const _schema = _.get(Schemas, route);

      if (_schema) {
        return Joi.validate(req.body, _schema, _validationOptions, (err, data) => {
          if (err) {
            const JoiError = {
              status: 422,
              error: {
                original: err._object,
                details: _.map(err.details, ({ message, type }) => ({
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
            res.status(422).json(_useJoiError ? JoiError : CustomError);
          } else {
            req.body = data;
            next();
          }
        });
      }
    }
  };
};
