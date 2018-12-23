import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';

const agent = request(app);

describe('Meetups API', () => {
  describe('POST /api/v1/meetups', () => {
    describe('handle valid data', () => {
      it('should create meetups', (done) => {
        agent
          .post('/api/v1/meetups')
          .expect(201)
          .send({
            topic: 'Meetup 1',
            location: 'Meetup Location',
            happeningOn: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.data.should.be.an('array');
            res.body.status.should.equal(201);

            done();
          });
      });
    });

    describe('handle invalid or missing data', () => {
      it('should not create a meetup if required fields are missing', (done) => {
        agent
          .post('/api/v1/meetups')
          .expect(400)
          .send({
            location: 'Meetup Location',
            happeningOn: new Date()
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(400);
            res.body.should.have.property('error');
            res.body.error.should.equal(
              'The topic, location and happeningOn fields are required fields'
            );
            done();
          });
      });

      it('should not create a meetup if required fields are missing', (done) => {
        agent
          .post('/api/v1/meetups')
          .expect(400)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location'
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(400);
            res.body.should.have.property('error');
            res.body.error.should.equal(
              'The topic, location and happeningOn fields are required fields'
            );
            done();
          });
      });

      it('should not create a meetup if date provided is past', (done) => {
        agent
          .post('/api/v1/meetups')
          .expect(422)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location',
            happeningOn: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            res.body.error.should.equal(
              'Meetup Date provided is in the past, provide a future date'
            );
            done();
          });
      });
    });
  });


  describe('GET /api/v1/meetups', () => {
    it('should return a list of meetups', (done) => {
      agent
        .get('/api/v1/meetups')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          done();
        });
    });
  });


  describe('GET /api/v1/meetups/:meetup-id', () => {
    it.only('should return a single meetups', (done) => {
      agent
        .get('/api/v1/meetups/1')
        .expect(200)
        .end((err, res) => {
          console.log(res.body);
          if (err) return done(err);
          // res.body.status.should.equal(200);
          // res.body.data.should.be.an('array');
          done();
        });
    });
  });
});
