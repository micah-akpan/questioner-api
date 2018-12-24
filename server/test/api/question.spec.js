import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';

const agent = request(app);

describe('Questions API', () => {
  describe('POST /api/v1/questions', () => {
    describe('handle valid data', () => {
      it('should create a question', (done) => {
        agent
          .post('/api/v1/questions')
          .send({
            title: 'question 1',
            body: 'question body'
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
        .patch('/api/v1/questions/999999999/upvote')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          done();
        });
    });
  });
});
