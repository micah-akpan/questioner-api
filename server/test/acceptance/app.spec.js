import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';

describe.only('Main App Middleware test', () => {
  describe('Error 404', () => {
    before(() => {
      // to suppress the error response
      // from being printed to the console
      app.set('env', 'test');
    });
    it('should catch 404 errors', (done) => {
      request(app)
        .get('/no/such/endpoint')
        .expect(404, done);
    });
  });
});
