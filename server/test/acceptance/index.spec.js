import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';

describe('Questioner Index API', () => {
  it('should return a welcome message and a 200 status', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.message.should.equal('Welcome to the Questioner API');
        done();
      });
  });
});
