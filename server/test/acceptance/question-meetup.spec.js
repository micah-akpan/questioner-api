import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';
import db from '../../db';
import { getFutureDate, createTestToken } from '../../utils';

const agent = request(app);

const createTestData = async () => {
  await db.queryDb({
    text: `INSERT INTO Meetup (topic, location, happeningOn)
           VALUES ($1, $2, $3)`,
    values: ['topic1', 'location1', getFutureDate()]
  });

  await db.queryDb({
    text: `INSERT INTO "User" (firstname, lastname, email, password)
           VALUES ($1, $2, $3, $4)`,
    values: ['user', 'user', 'user@gmail.com', 'user1234']
  });

  await db.queryDb({
    text: `INSERT INTO Question (title, body, createdBy, meetup)
           VALUES ($1, $2, $3, $4)`,
    values: ['topic', 'body', 1, 1]
  });
};

describe.only('MeetupQuestion API', () => {
  const apiBaseURL = '/api/v1';
  const testToken = createTestToken({});
  before(async () => {
    await db.dropTable({ tableName: 'Question' });
    await db.dropTable({ tableName: 'Meetup' });
    await db.dropTable({ tableName: '"User"' });

    await db.createTable('User');
    await db.createTable('Meetup');
    await db.createTable('Question');
  });

  describe('GET /meetups/<meetup-id>/questions/<question-id>', () => {
    beforeEach(async () => {
      await createTestData();

      after(async () => {
        await db.dropTable({ tableName: 'Question' });
        await db.dropTable({ tableName: 'Meetup' });
        await db.dropTable({ tableName: '"User"' });
      });
    });

    it('should get a single meetup question', (done) => {
      agent
        .get('/api/v1/meetups/1/questions/1')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200, done);
    });

    it('should return error if question does not exist', (done) => {
      agent
        .get('/api/v1/meetups/1/questions/9999')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(404, done);
    });
  });

  describe('PATCH /meetups/<meetup-id>/questions/<question-id>', () => {
    before(async () => {
      await db.dropTable({ tableName: '"User"' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: 'Question' });

      await db.createTable('User');
      await db.createTable('Meetup');
      await db.createTable('Question');
    });

    beforeEach(async () => {
      await createTestData();
    });

    it('should update a meetup question', (done) => {
      agent
        .patch(`${apiBaseURL}/meetups/1/questions/1`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ title: 'new title' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          done();
        });
    });

    it('should update a meetup question', (done) => {
      agent
        .patch(`${apiBaseURL}/meetups/1/questions/1`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ body: 'new body' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          done();
        });
    });

    it('should return an error for a non-existing question', (done) => {
      agent
        .patch(`${apiBaseURL}/meetups/1/questions/99999`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ title: 'new title', userId: 1 })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe('GET /meetups/<meetup-id>/questions', () => {
    before(async () => {
      await db.dropTable({ tableName: '"User"' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: 'Question' });

      await db.createTable('User');
      await db.createTable('Meetup');
      await db.createTable('Question');
    });

    describe('handle valid request', () => {
      beforeEach(async () => {
        await createTestData();
      });
      it('should return all meetup questions', (done) => {
        agent
          .get('/api/v1/meetups/1/questions')
          .set('access-token', testToken)
          .expect(200, done);
      });
    });

    describe('handle invalid request', () => {
      before(async () => {
        await db.queryDb({
          text: 'DELETE FROM Question'
        });
      });
      it('should return an error if no questions are found', (done) => {
        agent
          .get('/api/v1/meetups/1/questions')
          .set('access-token', testToken)
          .expect(404, done);
      });
    });
  });

  after(async () => {
    await db.dropTable({ tableName: 'Question' });
    await db.dropTable({ tableName: 'Meetup' });
    await db.dropTable({ tableName: '"User"' });
  });
});
