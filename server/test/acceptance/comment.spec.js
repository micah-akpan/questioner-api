import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';
import db from '../../db';
import { createTestToken, getFutureDate } from '../../utils';

describe.only('Comments API', () => {
  const testToken = createTestToken({ });
  const agent = request(app);
  before(async () => {
    await db.dropTable({ tableName: 'Comment' });
    await db.dropTable({ tableName: 'Question' });
    await db.dropTable({ tableName: 'Meetup' });
    await db.dropTable({ tableName: '"User"' });

    await db.createTable('User');
    await db.createTable('Meetup');
    await db.createTable('Question');
    await db.createTable('Comment');
  });

  beforeEach(async () => {
    await db.queryDb({
      text: `INSERT INTO "User" (firstname, lastname, email, password)
             VALUES ($1, $2, $3, $4)`,
      values: ['user1', 'user1', 'user1@email.com', 'user1234']
    });
    await db.queryDb({
      text: `INSERT INTO Meetup (topic, location, happeningOn)
             VALUES ($1, $2, $3)`,
      values: ['sample topic', 'sample location', getFutureDate(2)]
    });

    await db.queryDb({
      text: `INSERT INTO Question (title, body, meetup, createdBy)
             VALUES ($1, $2, $3, $4)`,
      values: ['sample topic', 'sample location', 1, 1]
    });
    await db.queryDb({
      text: `INSERT INTO Comment (body, question)
             VALUES ('sample body', 1)`
    });
  });
  describe('GET /questions/<question-id>/comments', () => {
    it('should return all comments', (done) => {
      agent
        .get('/api/v1/questions/1/comments')
        .set('access-token', testToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should return a 404 response for a non-existing question', (done) => {
      agent
        .get('/api/v1/questions/999999/comments')
        .set('access-token', testToken)
        .expect(404, done);
    });
  });

  describe('POST /comments', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Comment' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: '"User"' });

      await db.createTable('User');
      await db.createTable('Meetup');
      await db.createTable('Question');
      await db.createTable('Comment');
    });
    beforeEach(async () => {
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
        text: `INSERT INTO Question (title, body, createdBy, meetup) 
        VALUES ($1, $2, $3, $4)`,
        values: ['question 1', 'question body', 1, 1]
      });
    });

    describe('handle valid data', () => {
      it('should add a comment to a question', (done) => {
        agent
          .post('/api/v1/comments')
          .set('Authorization', `Bearer ${testToken}`)
          .send({
            questionId: '1',
            comment: 'a comment'
          })
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(201);
            res.body.data.should.be.an('array');
            res.body.data.length.should.equal(1);
            res.body.data[0].question.should.equal(1);
            done();
          });
      });

      it('should add a comment to a question', (done) => {
        agent
          .post('/api/v1/comments')
          .set('Authorization', `Bearer ${testToken}`)
          .send({
            questionId: '1',
            comment: 'a new comment'
          })
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(201);
            res.body.data.should.be.an('array');
            res.body.data.length.should.equal(1);
            res.body.data[0].question.should.equal(1);
            done();
          });
      });
    });

    describe('handle invalid data', () => {
      it('should not add a comment to a non-existing question', (done) => {
        agent
          .post('/api/v1/comments')
          .set('Authorization', `Bearer ${testToken}`)
          .send({
            questionId: '9999999',
            comment: 'a new comment'
          })
          .expect(404)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(404);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should not add a comment if required data are missing', (done) => {
        agent
          .post('/api/v1/comments')
          .set('Authorization', `Bearer ${testToken}`)
          .send({
            comment: 'a new comment'
          })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(400);
            res.body.should.have.property('error');
            done();
          });
      });
    });
  });
});
