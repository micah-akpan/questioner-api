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
      // schema for the current route
      const _schema = _.get(Schemas, route);

      if (_schema) {
        return Joi.validate(req.body, _schema, _validationOptions, (err, data) => {
          if (err) {
            const JoiError = {
              status: 'failed',
              error: {
                original: err._object,
                details: _.map(err.details, ({ message, type }) => ({
                  message: message.replace(/['"]/g, ''),
                  type
                }))
              }
            };

            // Custom Error
            const CustomError = {
              status: 'failed',
              error: 'Invalid request data. Please review request and try again.'
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
