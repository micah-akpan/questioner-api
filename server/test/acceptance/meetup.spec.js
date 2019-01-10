import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';
import db from '../../db';
import createTableQueries from '../../models/helpers';
import { getFutureDate } from '../../utils';

const agent = request(app);

describe.only('Meetups API', () => {
  before('Setup', async () => {
    // Drop referencing tables
    await db.queryDb({
      text: 'DROP TABLE IF EXISTS Rsvp'
    });

    await db.queryDb({
      text: 'DROP TABLE IF EXISTS Question'
    });


    await db.queryDb({
      text: 'DROP TABLE IF EXISTS Meetup'
    });

    // Create tables
    await db.queryDb(createTableQueries.createMeetupSQLQuery);
  });
  describe('POST /meetups', () => {
    describe('handle valid data', () => {
      it('should create a meetup', (done) => {
        agent
          .post('/api/v2/meetups')
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
          .post('/api/v2/meetups')
          .expect(422)
          .send({
            location: 'Meetup Location',
            happeningOn: new Date()
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should not create a meetup if required fields are missing', (done) => {
        agent
          .post('/api/v2/meetups')
          .expect(422)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location'
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should not create a meetup if date is invalid', (done) => {
        agent
          .post('/api/v2/meetups')
          .expect(422)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location',
            happeningOn: 'Some Invalid date'
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should not create a meetup if date provided is past', (done) => {
        agent
          .post('/api/v2/meetups')
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
            done();
          });
      });
    });
  });


  describe('GET meetups', () => {
    before(async () => {
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Rsvp' });
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Comment' });
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Question' });
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Meetup' });

      await db.queryDb(createTableQueries.createMeetupSQLQuery);
    });

    beforeEach(async () => {
      // bulk-create test meetups
      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3),
               ($4, $5, $6) RETURNING *`,
        values: [
          'meetup topic',
          'meetup location',
          getFutureDate(),
          'next topic',
          'next location',
          getFutureDate()
        ]
      });
    });
    it('should return a list of meetups', (done) => {
      agent
        .get('/api/v2/meetups')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should return a list of matched meetups', (done) => {
      agent
        .get('/api/v2/meetups?searchTerm=meetup topic')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          res.body.data.length.should.be.greaterThan(0);
          done();
        });
    });

    it('should return a list of matched meetups', (done) => {
      agent
        .get('/api/v2/meetups?searchTerm=next location')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          res.body.data.length.should.be.greaterThan(0);
          done();
        });
    });

    afterEach(async () => {
      await db.queryDb({
        text: 'DELETE FROM Meetup'
      });
    });
  });


  describe('GET /meetups/<meetup-id>', () => {
    it('should return a single meetup', (done) => {
      agent
        .get('/api/v2/meetups/1')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('id');
          res.body.data[0].should.have.property('topic');
          res.body.data[0].should.not.have.property('createdOn');
          done();
        });
    });

    it('should return a 404 error for a non-existing meetup', (done) => {
      agent
        .get('/api/v2/meetups/9999999')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.error.should.equal('The requested meetup does not exist');
          done();
        });
    });
  });


  describe('DELETE /meetups/<meetup-id>/', () => {
    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
              VALUES ($1, $2, $3)`,
        values: ['meetup sample 1', 'meetup sample location', getFutureDate(2)]
      });
    });

    it('should delete a single meetup', (done) => {
      agent
        .delete('/api/v2/meetups/1')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should return an error for a non-existing meetup', (done) => {
      agent
        .delete('/api/v2/meetups/9999999')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });

    afterEach(async () => {
      await db.queryDb({
        text: 'DELETE FROM Meetup'
      });
    });
  });

  describe('GET /api/v2/meetups/upcoming', () => {
    it('should return a list of upcoming meetups', (done) => {
      agent
        .get('/api/v2/meetups/upcoming')
        .expect(200, done);
    });
  });

  describe('Update a meetup Question', () => {
    it('should update a meetup question', (done) => {
      agent
        .patch('/api/v2/meetups/2/questions/2')
        .send({ userId: '1' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should return an error for a question that doesn\'t exist', (done) => {
      agent
        .delete('/api/v2/meetups/2/questions/2')
        .send({ userId: '9999999' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe('Fetch all questions of a specific meetup', () => {
    it('should return all questions asked in a meetup', (done) => {
      agent
        .get('/api/v2/meetups/1/questions')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should return an error for no questions', (done) => {
      agent
        .get('/api/v2/meetups/9999999/questions')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe('Fetch a meetup question GET /meetups/<meetup-id>/questions/<question-id>', () => {
    it('should return a meetup question record', (done) => {
      agent
        .get('/api/v2/meetups/3/questions/3')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          res.body.data.length.should.equal(1);
          done();
        });
    });

    it('should return an error for a non-existing meetup question', (done) => {
      agent
        .get('/api/v2/meetups/3/questions/9999999')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });

    describe('Fetch all RSVPs of a meetup, GET /meetups/<meetup-id>/rsvps', () => {
      it('should return all RSVPs of a meetup', (done) => {
        agent
          .get('/api/v2/meetups/1/rsvps')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(200);
            res.body.should.have.property('data');
            done();
          });
      });

      it('should return an error if there are no RSVPs for a meetup', (done) => {
        agent
          .get('/api/v2/meetups/999999/rsvps')
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
});
