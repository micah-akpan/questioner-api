import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';
import db from '../../db';
import createTableQueries from '../../models/helpers';

describe.only('User API', () => {
  before(async () => {
    // DROP tables
    await db.queryDb({ text: 'DROP TABLE IF EXISTS Rsvp' });
    await db.queryDb({ text: 'DROP TABLE IF EXISTS Question' });
    await db.queryDb({ text: 'DROP TABLE IF EXISTS Users' });
  });

  describe('POST /auth/signup', () => {
    beforeEach(async () => {
      await db.queryDb(createTableQueries.createUserSQLQuery);
    });

    afterEach(async () => {
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Rsvp' });
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Question' });
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Users' });
    });

    describe('handle valid/complete data', () => {
      it('should create a new user', (done) => {
        request(app)
          .post('/api/v2/auth/signup')
          .send({
            email: 'testuser@gmail.com',
            password: 'testuser1234',
            firstname: 'Test',
            lastname: 'User'
          })
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(201);
            res.body.data.should.be.an('array');
            res.body.data[0].user.email.should.equal('testuser@gmail.com');
            done();
          });
      });
    });

    describe('handle invalid data', () => {
      before(async () => {
        // create test user
        // TODO: Seed database prior to test

        await db.queryDb(createTableQueries.createUserSQLQuery);

        await db.queryDb({
          text: `INSERT INTO Users(firstname,lastname,email,password)
                 VALUES ('user1', 'user1', 'user1@email.com', 'user1234')
                `
        });
      });
      it('should return an error if user already exist', (done) => {
        request(app)
          .post('/api/v2/auth/signup')
          .send({
            email: 'user1@email.com',
            password: 'user1234',
            firstname: 'user1',
            lastname: 'user1'
          })
          .expect(422)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            res.body.error.should.equal('A user with this email already exists');
            done();
          });
      });
    });
  });

  after(async () => {
    // DROP tables
    await db.queryDb({ text: 'DROP TABLE IF EXISTS Rsvp' });
    await db.queryDb({ text: 'DROP TABLE IF EXISTS Question' });
    await db.queryDb({ text: 'DROP TABLE IF EXISTS Users' });
  });
});
