import 'chai/register-should';
import request from 'supertest';
import { app } from '../../app';

const agent = request(app);

describe('Meetups API', () => {
  describe('POST /api/v1/meetups', () => {
    describe('handle valid data', () => {
      it('should create a meetup', (done) => {
        agent
          .post('/api/v1/meetups')
          .expect(201)
          .send({
            topic: 'Meetup 1',
            location: 'Meetup Location',
            happeningOn: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
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
          .expect(422)
          .send({
            location: 'Meetup Location',
            happeningOn: new Date()
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            done();
          });
      });

      it('should not create a meetup if required fields are missing', (done) => {
        agent
          .post('/api/v1/meetups')
          .expect(422)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location'
          })
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
          .expect(422)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location',
            happeningOn: 'Some Invalid date'
          })
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
          .expect(422)
          .send({
            topic: 'Awesome Meetup',
            location: 'Meetup Location',
            happeningOn: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
          })
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(422);
            res.body.should.have.property('error');
            done();
          });
      });
    });
  });


  describe('GET /api/v1/meetups', () => {
    it('should return a list of meetups', (done) => {
      agent
        .get('/api/v1/meetups')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.data.should.be.an('array');
          done();
        });
    });
  });


  describe('GET /api/v1/meetups/:id', () => {
    it('should return a single meetup', (done) => {
      agent
        .get('/api/v1/meetups/1')
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
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.error.should.equal('The requested meetup does not exist');
          done();
        });
    });
  });


  describe.skip('DELETE /api/v1/meetups/:id', () => {
    it('should delete a single meetup', (done) => {
      agent
        .delete('/api/v1/meetups/1')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          done();
        });
    });

    it('should return an error for a non-existing meetup', (done) => {
      agent
        .delete('/api/v1/meetups/9999999')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/v1/meetups/upcoming', () => {
    it('should return a list of upcoming meetups', (done) => {
      agent
        .get('/api/v1/meetups/upcoming')
        .expect(200, done);
    });
  });

  describe('GET /api/v1/meetups/search', () => {
    describe('Search by Topic', () => {
      it('should return a list of meetups that meets the search criteria', (done) => {
        agent
          .get('/api/v1/meetups/search')
          .query({ searchTerm: 'meetup 1' })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(200);
            res.body.data.should.be.an('array');
            res.body.data.length.should.be.greaterThan(0);
            done();
          });
      });

      it('should return an error for a no match search', (done) => {
        agent
          .get('/api/v1/meetups/search')
          .query({ searchTerm: 'blah blah blah' })
          .expect(404)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(404);
            res.body.error.should.be.a('string');
            done();
          });
      });
    });

    describe('Search by Location', () => {
      it('should return a list of meetups that meets the search criteria', (done) => {
        agent
          .get('/api/v1/meetups/search')
          .query({ searchTerm: 'Meetup location 3' })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(200);
            res.body.data.should.be.an('array');
            res.body.data.length.should.be.greaterThan(0);
            done();
          });
      });

      it('should return an error for a no match search', (done) => {
        agent
          .get('/api/v1/meetups/search')
          .query({ searchTerm: 'some place in paris' })
          .expect(404)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(404);
            res.body.error.should.be.a('string');
            done();
          });
      });
    });

    describe('Search by Tag', () => {
      it('should return a list of meetups that meets the search criteria', (done) => {
        agent
          .get('/api/v1/meetups/search')
          .query({ searchTerm: 'food festival' })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(200);
            res.body.data.should.be.an('array');
            res.body.data.length.should.be.greaterThan(0);
            done();
          });
      });

      it('should return an error for a no match search', (done) => {
        agent
          .get('/api/v1/meetups/search')
          .query({ searchTerm: 'no tag' })
          .expect(404)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(404);
            res.body.error.should.be.a('string');
            done();
          });
      });
    });
  });

  describe('Update a meetup Question', () => {
    it('should update a meetup question', (done) => {
      agent
        .delete('/api/v1/meetups/2/questions/2')
        .send({ userId: '1' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should return an error for a question that doesn\'t exist', (done) => {
      agent
        .delete('/api/v1/meetups/2/questions/2')
        .send({ userId: '9999999' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe('Fetch all questions of a specific meetup', () => {
    it('should return all questions asked in a meetup', (done) => {
      agent
        .get('/api/v1/meetups/1/questions')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          done();
        });
    });

    it('should return an error for no questions', (done) => {
      agent
        .get('/api/v1/meetups/9999999/questions')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe('Fetch a meetup question GET /meetups/<meetup-id>/questions/<question-id>', () => {
    it('should return a meetup question record', (done) => {
      agent
        .get('/api/v1/meetups/3/questions/3')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(200);
          res.body.should.have.property('data');
          res.body.data.length.should.equal(1);
          done();
        });
    });

    it('should return an error for a non-existing meetup question', (done) => {
      agent
        .get('/api/v1/meetups/3/questions/9999999')
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          res.body.status.should.equal(404);
          res.body.should.have.property('error');
          done();
        });
    });

    describe('Fetch all RSVPs of a meetup, GET /meetups/<meetup-id>/rsvps', () => {
      it('should return all rsvps of a meetup', (done) => {
        agent
          .get('/api/v1/meetups/1/rsvps')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.status.should.equal(200);
            res.body.should.have.property('data');
            done();
          });
      });

      it('should return an error if there are no rsvps for a meetup', (done) => {
        agent
          .get('/api/v1/meetups/999999/rsvps')
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
});
