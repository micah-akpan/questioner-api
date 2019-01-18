import 'chai/register-should';
import schemaValidator from '../../../../middlewares/schema/schemaValidator';

describe.only('Schema Middleware', () => {
  it('should return a middleware', () => {
    const validateMiddleware = schemaValidator(true);
    validateMiddleware.should.be.a('function');
  });
});
