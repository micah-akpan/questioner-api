import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';

const agent = request(app);

describe('POST /api/v1/meetups/<meetup-id>/rsvps', () => {
  it('should rsvp a user', (done) => {
    agent
      .post('/api/v1/meetups/2/rsvps')
      .send({ response: 'maybe', userId: '1' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.status.should.equal(201);
        res.body.data[0].should.have.property('topic');
        done();
      });
  });

  it('should not rsvp a user on a non-existent meetup', (done) => {
    agent
      .post('/api/v1/meetups/999999999999999/rsvps')
      .send({ response: 'yes', userId: '1' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        res.body.status.should.equal(404);
        done();
      });
  });

  it('should not rsvp a user if required fields are missing', (done) => {
    agent
      .post('/api/v1/meetups/1/rsvps')
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.status.should.equal(422);
        done();
      });
  });
});
