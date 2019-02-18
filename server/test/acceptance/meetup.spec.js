import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';
import db from '../../db';
import { getFutureDate, createTestToken } from '../../utils';

const agent = request(app);

describe.only('Meetups API', () => {
  const adminTestToken = createTestToken({ admin: true });
  const userTestToken = createTestToken({ admin: false });
  before('Setup', async () => {
    await db.dropTable({ tableName: 'Meetup' });
    await db.dropTable({ tableName: '"User"' });

    await db.createTable('Meetup');
    await db.createTable('Image');
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
            happeningOn: getFutureDate(),
            tags: []
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
      it.skip('should not create a meetup if required fields are missing', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${adminTestToken}`)
          .send({
            location: 'Meetup Location',
            happeningOn: getFutureDate(3)
          })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(400);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should return an error if user is not admin', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${userTestToken}`)
          .expect(403)
          .end((err, res) => {
            if (err) return done(err);
            res.body.error.should.equal('The requested action is only for admins');
            done();
          });
      });

      it.skip('should not create a meetup if required fields are missing', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${adminTestToken}`)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location'
          })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(400);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should not create a meetup if date is invalid', (done) => {
        agent
          .post('/api/v1/meetups')
          .set('Authorization', `Bearer ${adminTestToken}`)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location',
            happeningOn: 'Some Invalid date'
          })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(400);
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
      await db.dropTable({ tableName: 'Upvote' });
      await db.dropTable({ tableName: 'Downvote' });
      await db.dropTable({ tableName: 'Comment' });
      await db.dropTable({ tableName: 'Question' });
      await db.dropTable({ tableName: 'Rsvp' });
      await db.dropTable({ tableName: 'Meetup' });

      await db.createTable('Meetup');
      await db.createTable('User');
      await db.createTable('Question');
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
        text: `INSERT INTO Meetup (topic, location, happeningOn, tags)
              VALUES ($1, $2, $3, $4),
              ($5, $6, $7, $8)`,
        values: [
          'meetup sample 1',
          'meetup sample location',
          getFutureDate(2),
          '{"tag1"}',
          'meetup sample 2',
          'meetup sample location 2',
          getFutureDate(),
          '{"tag2","tag3","tag4","tag5","tag6"}'
        ]
      });
    });

    it('should add tags to a meetup', (done) => {
      agent
        .post('/api/v1/meetups/1/tags')
        .set({ Authorization: `Bearer ${adminTestToken}` })
        .send({
          tags: ['meetup1', 'meetup2']
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('tags');
          done();
        });
    });

    it('should not add tags to a non-existing meetup', (done) => {
      agent
        .post('/api/v1/meetups/9999/tags')
        .set({ Authorization: `Bearer ${adminTestToken}` })
        .send({
          tags: ['meetup1', 'meetup1', 'meetup1']
        })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.have.property('error');
          done();
        });
    });

    it('snould not adds to a meetup if it already has 5 tags', (done) => {
      agent
        .post('/api/v1/meetups/2/tags')
        .set({ Authorization: `Bearer ${adminTestToken}` })
        .send({
          tags: ['meetup2']
        })
        .expect(422)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.have.property('error');
          res.body.error.should.equal('Maximum tags a meetup can have is 5');
          done();
        });
    });

    it('should not add more than 5 tags to a meetup', (done) => {
      agent
        .post('/api/v1/meetups/1/tags')
        .set({ Authorization: `Bearer ${adminTestToken}` })
        .send({
          tags: ['meetup1', 'meetup1', 'meetup1', 'meetup1', 'meetup1', 'meetup1']
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
      await db.dropTable({ tableName: 'Meetup' });

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

    it('should add images to a meetup', (done) => {
      agent
        .post('/api/v1/meetups/1/images')
        .set('access-token', adminTestToken)
        .attach('meetupPhotos', `${process.cwd()}/server/assets/yoyo.jpeg`)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(201);
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('images');
          done();
        });
    });

    after(() => {

    });
  });

  describe('GET /meetups/<meetup-id>/images', () => {
    before(async () => {
      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn, images)
               VALUES ($1, $2, $3, $4)`,
        values: ['meetup sample', 'meetup location', getFutureDate(3), ['sample.img']]
      });
    });

    it('should return all meetup images', (done) => {
      agent
        .get('/api/v1/meetups/1/images')
        .set('Authorization', `Bearer ${userTestToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          done();
        });
    });
  });

  describe('PUT /meetups/<meetup-id>', () => {
    before(async () => {
      await db.dropTable({ tableName: 'Meetup' });
      await db.createTable('Meetup');
    });

    beforeEach(async () => {
      await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3)`,
        values: ['sample meetup topic', 'sample meetup location', getFutureDate()]
      });
    });

    describe('handle valid data', () => {
      it('should update meetup', (done) => {
        agent
          .put('/api/v1/meetups/1')
          .set('access-token', adminTestToken)
          .send({
            topic: 'updated topic',
            location: 'updated location'
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(200);
            res.body.should.have.property('data');
            res.body.data.should.be.an('array');
            res.body.data[0].topic.should.equal('updated topic');
            done();
          });
      });
    });

    describe('handle invalid data', () => {
      it('should return an error response for a non-existing meetup', (done) => {
        agent
          .put('/api/v1/meetups/99999')
          .set('access-token', adminTestToken)
          .send({
            topic: 'updated topic'
          })
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

  after(async () => {
    await db.dropTable({ tableName: 'Meetup' });
  });
});
