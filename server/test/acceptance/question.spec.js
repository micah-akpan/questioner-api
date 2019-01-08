import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';
import db from '../../db';
import createTableQueries from '../../models/helpers';
import { getFutureDate } from '../../utils';

const agent = request(app);

describe('Questions API', () => {
  before('Setup', async () => {
    await db.queryDb({ text: 'DROP TABLE IF EXISTS Comment' });
    await db.queryDb({ text: 'DROP TABLE IF EXISTS Question' });
    await db.queryDb({ text: 'DROP TABLE IF EXISTS Meetup' });
    await db.queryDb({ text: 'DROP TABLE IF EXISTS "User"' });
  });
  describe('POST /api/v1/questions', () => {
    describe('handle valid data', () => {
      it('should create a question', (done) => {
        agent
          .post('/api/v1/questions')
          .send({
            title: 'question 1',
            body: 'question body',
            meetupId: 2,
            userId: 4
          })
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(201);
            res.body.data.should.be.an('array');
            res.body.data.length.should.equal(1);
            res.body.data[0].should.have.property('title');
            res.body.data[0].title.should.equal('question 1');
            done();
          });
      });
    });

    describe('handle invalid data', () => {
      it('should return an error for missing data', (done) => {
        agent
          .post('/api/v1/questions')
          .send({
            title: 'question 1'
          })
          .expect(422)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          });
      });
    });
  });

  describe('PATCH /api/v1/questions/<question-id>/upvote', () => {
    it('should upvote a question', (done) => {
      agent
        .patch('/api/v1/questions/1/upvote')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should not upvote a non-existent question', (done) => {
      agent
        .patch('/api/v1/questions/999999999/upvote')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          done();
        });
    });
  });

  describe('PATCH /api/v1/questions/<question-id>/downvote', () => {
    it('should downvote a question', (done) => {
      agent
        .patch('/api/v1/questions/1/downvote')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should not downvote a non-existent question', (done) => {
      agent
        .patch('/api/v1/questions/999999999/downvote')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          done();
        });
    });
  });

  describe('GET /questions', () => {
    it('should return all questions', (done) => {
      agent
        .get('/api/v1/questions')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          done();
        });
    });
  });

  describe.only('POST /comments', () => {
    beforeEach(async () => {
      // bulk create
      // referenced tables

      await db.queryDb(createTableQueries.createUserSQLQuery);

      await db.queryDb(createTableQueries.createMeetupSQLQuery);

      await db.queryDb({
        text: `INSERT INTO "User" (firstname, lastname, email, password)
               VALUES ('user1', 'user1', 'user@email.com', 'user1234')`
      });

      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
                VALUES($1, $2, $3)`,
        values: ['meetup topic 1', 'meetup location 1', getFutureDate()]
      });

      await db.queryDb({
        text: 'SELECT * FROM Meetup',
      });

      await db.queryDb(createTableQueries.createQuestionSQLQuery);


      const insertQuery = {
        text: `INSERT INTO Question (title, body, createdBy, meetup) 
        VALUES ($1, $2, $3, $4)`,
        values: ['question 1', 'question body', 1, 1]
      };

      await db.queryDb(insertQuery);
    });
    it('should add a comment to a question', (done) => {
      agent
        .post('/api/v2/comments')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          res.body.data.length.should.equal(1);
          res.body.data[0].question.should.equal(1);
        });
    });

    after(async () => {
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Comment' });
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Question' });
      await db.queryDb({ text: 'DROP TABLE IF EXISTS Meetup' });
      await db.queryDb({ text: 'DROP TABLE IF EXISTS "User"' });
    });
  });
});
