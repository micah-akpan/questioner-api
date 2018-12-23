import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';

const agent = request(app);

describe('Questions API', () => {
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
    it('should not return an error for missing data', (done) => {
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
