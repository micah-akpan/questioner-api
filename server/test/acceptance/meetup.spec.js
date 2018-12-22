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
            happeningOn: new Date()
          })
          .end((err, res) => {
            if (err) throw err;
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
            if (err) throw err;
            res.body.status.should.equal(400);
            res.body.should.have.property('error');
            res.body.error.should.equal('The topic, location and happeningOn fields are required fields');
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
            if (err) throw err;
            res.body.status.should.equal(400);
            res.body.should.have.property('error');
            res.body.error.should.equal('The topic, location and happeningOn fields are required fields');
            done();
          });
      });
    });
  });
});
