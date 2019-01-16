import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';
import db from '../../db';
import { getFutureDate, createTestToken } from '../../utils';

const agent = request(app);

describe.only('Meetups API', () => {
  const adminTestToken = createTestToken(true);
  const userTestToken = createTestToken();
  before('Setup', async () => {
    await db.dropTable({ tableName: 'Rsvp' });
    await db.dropTable({ tableName: 'Question' });
    await db.dropTable({ tableName: 'Meetup' });

    await db.createTable('Meetup');
    await db.queryDb({
      text: `INSERT INTO Meetup(topic, location, happeningOn)
             VALUES ($1, $2, $3),
             ($4, $5, $6),
             ($7, $8, $9)`,
      values: [
        'topic 1',
        'location 1',
        getFutureDate(),

        'topic 2',
        'location 2',
        getFutureDate(),

        'topic 3',
        'location 3',
        getFutureDate()
      ]
    });
  });

  describe('POST /meetups', () => {
    describe('handle valid data', () => {
      it('should create a meetup', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${adminTestToken}`)
          .expect(201)
          .send({
            topic: 'Meetup 1',
            location: 'Meetup Location',
            happeningOn: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
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
          .set('Authorization', `Bearer ${adminTestToken}`)
          .send({
            location: 'Meetup Location',
            happeningOn: new Date()
          })
          .expect(422)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should return an error for meetup tags greater than 5', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${adminTestToken}`)
          .expect(422)
          .send({
            topic: 'Meetup 1',
            location: 'Meetup Location',
            happeningOn: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            tags: 'meetup1,meetup1,meetupx,mymeetup,meetup1,fun'
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.should.have.property('error');
            res.body.error.should.equal('You cannot add more than 5 tags to this meetup');
            res.body.status.should.equal(422);
            done();
          });
      });

      it('should not create a meetup if required fields are missing', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${createTestToken()}`)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location'
          })
          .expect(422)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should not create a meetup if date is invalid', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${createTestToken()}`)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location',
            happeningOn: 'Some Invalid date'
          })
          .expect(422)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should not create a meetup if date provided is past', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${adminTestToken}`)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location',
            happeningOn: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
          })
          .expect(422)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should not create a meetup if date provided is past', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${adminTestToken}`)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location',
            happeningOn: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
          })
          .expect(422)
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
      await db.createTable('Meetup');
    });

    beforeEach(async () => {
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
        .get('/api/v1/meetups')
        .set('Authorization', `Bearer ${userTestToken}`)
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
        .get('/api/v1/meetups?searchTerm=meetup topic')
        .set('Authorization', `Bearer ${userTestToken}`)
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
        .get('/api/v1/meetups?searchTerm=next location')
        .set('Authorization', `Bearer ${userTestToken}`)
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
    let results = null;

    beforeEach(async () => {
      results = await db.queryDb({
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
    it('should return a single meetup', (done) => {
      const meetupRecord = results.rows[0];
      agent
        .get(`/api/v1/meetups/${meetupRecord.id}`)
        .set('Authorization', `Bearer ${userTestToken}`)
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
        .get('/api/v1/meetups/9999999')
        .set('Authorization', `Bearer ${userTestToken}`)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.error.should.equal('The requested meetup does not exist');
          done();
        });
    });

    afterEach(async () => {
      await db.queryDb({
        text: 'DELETE FROM Meetup'
      });
    });
  });


  describe('DELETE /meetups/<meetup-id>/', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Rsvp' });
      await db.dropTable({ tableName: 'Comment' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Meetup' });

      await db.createTable('Meetup');
    });
    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
              VALUES ($1, $2, $3)`,
        values: ['meetup sample 1', 'meetup sample location', getFutureDate(2)]
      });
    });

    it('should delete a single meetup', (done) => {
      agent
        .delete('/api/v1/meetups/1')
        .set('Authorization', `Bearer ${adminTestToken}`)
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
        .delete('/api/v1/meetups/9999999')
        .set('Authorization', `Bearer ${adminTestToken}`)
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

  describe('GET /meetups/upcoming', () => {
    before(async () => {
      await db.createTable('Meetup');
    });

    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
              VALUES ($1, $2, $3)`,
        values: [
          'meetup sample 1',
          'meetup sample location',
          getFutureDate(2)]
      });
    });
    it('should return a list of upcoming meetups', (done) => {
      agent
        .get('/api/v1/meetups/upcoming')
        .set('Authorization', `Bearer ${userTestToken}`)
        .expect(200, done);
    });

    afterEach(async () => {
      await db.queryDb({
        text: 'DELETE FROM Meetup'
      });
    });
  });

  describe('POST /meetups/<meetup-id>/tags', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Rsvp' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: '"User"' });

      await db.createTable('Meetup');

      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
              VALUES ($1, $2, $3)`,
        values: [
          'meetup sample 1',
          'meetup sample location',
          getFutureDate(2)]
      });
    });

    it('should add tags to a meetup', (done) => {
      agent
        .post('/api/v1/meetups/1/tags')
        .set({ Authorization: `Bearer ${adminTestToken}` })
        .send({
          tags: 'meetup1,meetup1,meetup1'
        })
        .expect(201, done);
    });

    it('should not add tags to a non-existing meetup', (done) => {
      agent
        .post('/api/v1/meetups/999999/tags')
        .set({ Authorization: `Bearer ${adminTestToken}` })
        .send({
          tags: 'meetup1,meetup1,meetup1'
        })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.have.property('error');
          done();
        });
    });

    it('should not add more than 5 tags to a meetup', (done) => {
      agent
        .post('/api/v1/meetups/1/tags')
        .set({ Authorization: `Bearer ${adminTestToken}` })
        .send({
          tags: 'meetup1,meetup1,meetup1,meetup1,meetup1,meetup1'
        })
        .expect(422)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.have.property('error');
          res.body.error.should.equal('You cannot add more than 5 tags to this meetup');
          done();
        });
    });
  });

  describe.skip('POST /meetups/<meetup-id>/images', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Rsvp' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Meetup' });
      await db.dropTable({ tableName: '"User"' });

      await db.createTable('Meetup');

      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
              VALUES ($1, $2, $3)`,
        values: [
          'meetup sample 1',
          'meetup sample location',
          getFutureDate(2)]
      });
    });
  });

  after(async () => {
    await db.dropTable({ tableName: 'Rsvp' });
    await db.dropTable({ tableName: 'Question' });
    await db.dropTable({ tableName: 'Question' });
    await db.dropTable({ tableName: 'Meetup' });
    await db.dropTable({ tableName: '"User"' });
  });
});
