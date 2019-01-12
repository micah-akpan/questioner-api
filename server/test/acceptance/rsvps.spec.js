import 'chai/register-should';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../app';
import db from '../../db';
import { getFutureDate } from '../../utils';

const agent = request(app);

describe.only('RSVP API', () => {
  const createTestToken = (admin = false) => jwt.sign({
    email: 'testuser@email.com', admin
  }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });

  before(async () => {
    await db.dropTable({ tableName: 'Rsvp' });
    await db.dropTable({ tableName: 'Meetup' });
    await db.dropTable({ tableName: '"User"' });

    await db.createTable({ tableName: 'User' });
    await db.createTable({ tableName: 'Meetup' });
    await db.createTable({ tableName: 'Rsvp' });
  });

  describe('POST /meetups/<meetup-id>/rsvps', () => {
    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3)`,
        values: ['m topic', 'm location', getFutureDate()]
      });

      await db.queryDb({
        text: `INSERT INTO "User" (email, password, firstname, lastname)
               VALUES ($1, $2, $3, $4)`,
        values: ['user@email.com', 'user1234', 'user1', 'user1']
      });
    });
    it('should rsvp a user', (done) => {
      agent
        .post('/api/v2/meetups/1/rsvps')
        .set('Authorization', `Bearer ${createTestToken()}`)
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
        .post('/api/v2/meetups/99999999/rsvps')
        .set('Authorization', `Bearer ${createTestToken()}`)
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
        .post('/api/v2/meetups/1/rsvps')
        .set('Authorization', `Bearer ${createTestToken()}`)
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
        .patch('/api/v2/meetups/1/rsvps/1')
        .send({ response: 'no' })
        .set('Authorization', `Bearer ${createTestToken()}`)
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
        .patch('/api/v2/meetups/1/rsvps/1')
        .set('Authorization', `Bearer ${createTestToken()}`)
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
        .patch('/api/v2/meetups/999999999/rsvps/1')
        .set('Authorization', `Bearer ${createTestToken()}`)
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

  describe('GET /meetups/<meetup-id>/rsvps/<rsvp-id>', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Rsvp' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: '"User"' });

      await db.createTable({ tableName: 'User' });
      await db.createTable({ tableName: 'Meetup' });
      await db.createTable({ tableName: 'Rsvp' });
    });
    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3)`,
        values: ['m topic', 'm location', getFutureDate()]
      });

      await db.queryDb({
        text: `INSERT INTO "User" (email, password, firstname, lastname)
               VALUES ($1, $2, $3, $4)`,
        values: ['user@email.com', 'user1234', 'user1', 'user1']
      });

      await db.queryDb({
        text: `INSERT INTO Rsvp (response, meetup, "user")
               VALUES ($1, $2, $3)`,
        values: ['yes', 1, 1]
      });
    });
    it('should return a single meetup rsvp', (done) => {
      agent
        .get('/api/v2/meetups/1/rsvps/1')
        .set('Authorization', `Bearer ${createTestToken()}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          res.body.data.length.should.equal(1);
          done();
        });
    });

    it('should return an error if meetup rsvp does not exist', (done) => {
      agent
        .get('/api/v2/meetups/1/rsvps/999999')
        .set('Authorization', `Bearer ${createTestToken()}`)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });

    afterEach(async () => {
      await db.queryDb({ text: 'DELETE FROM Rsvp' });
    });
  });

  after(async () => {
    await db.dropTable({ tableName: 'Rsvp' });
    await db.dropTable({ tableName: 'Meetup' });
    await db.dropTable({ tableName: '"User"' });
  });
});
