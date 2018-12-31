import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';

const agent = request(app);

describe('RSVP API', () => {
  describe('POST /meetups/<meetup-id>/rsvps', () => {
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
        .post('/api/v1/meetups/99999999/rsvps')
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

  describe('PATCH /meetups/<meetup-id>/rsvps/<rsvp-id>', () => {
    it('should update an existing RSVP', (done) => {
      agent
        .patch('/api/v1/meetups/1/rsvps/1')
        .send({ response: 'no' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          res.body.data[0].response.should.equal('no');
          done();
        });
    });

    it('should update an existing RSVP', (done) => {
      agent
        .patch('/api/v1/meetups/1/rsvps/1')
        .send({ response: '' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          res.body.data[0].response.should.equal('no');
          done();
        });
    });

    it('should return an error for a non-existing RSVP', (done) => {
      agent
        .patch('/api/v1/meetups/999999999/rsvps/1')
        .send({ response: 'maybe' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });
  });
});
