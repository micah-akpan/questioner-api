import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';
import db from '../../db';
import { getFutureDate, createTestToken } from '../../utils';

const agent = request(app);

describe.only('Questions API', () => {
  const adminTestToken = createTestToken({ admin: true });
  const userTestToken = createTestToken({ admin: false });

  before('Setup', async () => {
    await db.dropTable({ tableName: 'Question' });

    await db.createTable('User');
    await db.createTable('Meetup');
    await db.createTable('Question');
  });

  describe('POST /questions', () => {
    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO "User" (email, password, firstname, lastname)
               VALUES ($1, $2, $3, $4)`,
        values: ['testuser@email.com', 'user1234', 'Test', 'User']
      });

      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3)`,
        values: ['topic 1', 'location 1', getFutureDate()]
      });
    });
    describe('handle valid data', () => {
      it('should create a question', (done) => {
        request(app)
          .post('/api/v1/questions')
          .set('Authorization', `Bearer ${userTestToken}`)
          .send({
            title: 'question 1',
            body: 'question body',
            meetupId: '1',
            userId: '1'
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
          .set('Authorization', `Bearer ${userTestToken}`)
          .send({
            title: 'question 1'
          })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(400);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          });
      });
    });
  });

  describe('PATCH /questions/<question-id>/upvote', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Upvote' });
      await db.dropTable({ tableName: 'Downvote' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: '"User"' });

      await db.createTable('User');
      await db.createTable('Meetup');
      await db.createTable('Question');
      await db.createTable('Upvote');
      await db.createTable('Downvote');
    });

    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO "User" (email, password, firstname, lastname)
               VALUES ($1, $2, $3, $4)`,
        values: ['testuser@email.com', 'user1234', 'Test', 'User']
      });

      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3)`,
        values: ['topic 1', 'location 1', getFutureDate()]
      });

      await db.queryDb({
        text: `INSERT INTO Question (title, body, createdBy, meetup)
               VALUES ($1, $2, $3, $4)`,
        values: ['question 1', 'question body', 1, 1]
      });
    });
    it('should upvote a question', (done) => {
      agent
        .patch('/api/v1/questions/1/upvote')
        .set('Authorization', `Bearer ${userTestToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should not upvote a question already upvoted by the same user', (done) => {
      agent
        .patch('/api/v1/questions/1/upvote')
        .set('Authorization', `Bearer ${userTestToken}`)
        .send({ userId: '1' })
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(409);
          res.body.should.have.property('error');
          done();
        });
    });

    it('should not upvote a non-existent question', (done) => {
      agent
        .patch('/api/v1/questions/999999999/upvote')
        .set('Authorization', `Bearer ${userTestToken}`)
        .send({ userId: '1' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          done();
        });
    });
  });

  describe('PATCH /api/v1/questions/<question-id>/downvote', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Downvote' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: '"User"' });

      await db.createTable('User');
      await db.createTable('Meetup');
      await db.createTable('Question');
      await db.createTable('Downvote');
    });

    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO "User" (email, password, firstname, lastname)
               VALUES ($1, $2, $3, $4)`,
        values: ['testuser@email.com', 'user1234', 'Test', 'User']
      });

      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3)`,
        values: ['topic 1', 'location 1', getFutureDate()]
      });

      await db.queryDb({
        text: `INSERT INTO Question (title, body, createdBy, meetup)
               VALUES ($1, $2, $3, $4)`,
        values: ['question 1', 'question body', 1, 1]
      });
    });
    it('should downvote a question', (done) => {
      agent
        .patch('/api/v1/questions/1/downvote')
        .send({ userId: '1' })
        .set('Authorization', `Bearer ${userTestToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should not downvote a question already downvoted by the same user', (done) => {
      agent
        .patch('/api/v1/questions/1/downvote')
        .send({ userId: '1' })
        .set('Authorization', `Bearer ${userTestToken}`)
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(409);
          res.body.should.have.property('error');
          res.body.error.should.equal('You have already downvoted this question');
          done();
        });
    });

    it('should not downvote a non-existent question', (done) => {
      agent
        .patch('/api/v1/questions/999999999/downvote')
        .set('Authorization', `Bearer ${userTestToken}`)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          done();
        });
    });
  });

  describe('GET /questions', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Upvote' });
      await db.dropTable({ tableName: 'Downvote' });
      await db.dropTable({ tableName: 'Comment' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Rsvp' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: '"User"' });

      await db.createTable('User');
      await db.createTable('Meetup');
      await db.createTable('Question');
      await db.createTable('Upvote');
      await db.createTable('Downvote');

      await db.queryDb({
        text: `INSERT INTO "User" (email, password, firstname, lastname)
               VALUES ($1, $2, $3, $4)`,
        values: ['testuser@email.com', 'user1234', 'Test', 'User']
      });

      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3)`,
        values: ['topic 1', 'location 1', getFutureDate()]
      });

      await db.queryDb({
        text: `INSERT INTO Question (title, body, createdBy, meetup)
               VALUES ($1, $2, $3, $4),
               ($5, $6, $7, $8)`,
        values: [
          'question 1',
          'question body',
          1,
          1,

          'question 2',
          'question body 2',
          1,
          1
        ]
      });
    });
    it('should return all questions', (done) => {
      agent
        .get('/api/v1/questions')
        .set('Authorization', `Bearer ${createTestToken(true)}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          res.body.data.length.should.equal(2);
          done();
        });
    });
  });

  describe('DELETE /meetups/<meetup-id>/questions/<question-id>', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: '"User"' });

      await db.createTable('User');
      await db.createTable('Meetup');
      await db.createTable('Question');
    });

    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO "User" (firstname, lastname, email, password)
               VALUES ('test1', 'test1', 'test1@test.com', 'test1234')`
      });

      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3)`,
        values: ['topic 1', 'topic 2', getFutureDate()]
      });

      await db.queryDb({
        text: `INSERT INTO Question (title, body, meetup, createdBy)
               VALUES ($1, $2, $3, $4)`,
        values: ['title 1', 'body 1', 1, 1]
      });
    });

    it('should delete a meetup question', (done) => {
      agent
        .delete('/api/v1/meetups/1/questions/1')
        .set('access-token', adminTestToken)
        .expect(200, done);
    });
  });

  after('Teardown', async () => {
    await db.dropTable({ tableName: 'Upvote' });
    await db.dropTable({ tableName: 'Downvote' });
    await db.dropTable({ tableName: 'Comment' });
    await db.dropTable({ tableName: 'Rsvp' });

    await db.dropTable({ tableName: 'Question' });
    await db.dropTable({ tableName: 'Meetup' });
    await db.dropTable({ tableName: '"User"' });
  });
});
