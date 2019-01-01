import 'chai/register-should';
import sinon from 'sinon';
import meetupController from '../../controllers/meetup';
import { getFutureDate } from '../../utils';

describe('Meetups API', () => {
  describe('Get all meetups', () => {
    it('should fetch all meetups', () => {
      const res = {};
      const req = {
        query: {

        }
      };

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      meetupController.getAllMeetups(req, res);

      res.status.calledOnce.should.be.true;
      res.send.calledOnce.should.be.true;

      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].status.should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
      res.send.firstCall.args[0].data.should.be.an('array');
    });

    it('should fetch meetups based on a search criteria', () => {
      const res = {};
      const req = {
        query: {
          searchTerm: 'Meetup 2'
        }
      };

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      meetupController.getAllMeetups(req, res);

      res.status.calledOnce.should.be.true;
      res.send.calledOnce.should.be.true;

      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
      res.send.firstCall.args[0].data.should.be.an('array');
      res.send.firstCall.args[0].data.length.should.be.greaterThan(0);
    });

    it('should return a no-match error if no meetup match the search criteria', () => {
      const res = {};
      const req = {
        query: {
          searchTerm: 'Music Festival'
        }
      };

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      meetupController.getAllMeetups(req, res);

      res.status.calledOnce.should.be.true;
      res.send.calledOnce.should.be.true;

      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });

  describe('Create Meetup', () => {
    describe('handle invalid user input', () => {
      it('should not create meetup with incomplete data', () => {
        const req = {
          body: {}
        };
        const res = {};

        res.status = sinon.fake.returns(res);
        res.send = sinon.fake.returns(res);

        meetupController.createNewMeetup(req, res);

        res.status.firstCall.args[0].should.equal(400);
        res.send.firstCall.args[0].should.have.property('error');
        res.send.firstCall.args[0].error.should.deep.equal('The topic, location and happeningOn fields are required fields');
      });

      it('should not create meetup with incomplete data', () => {
        const req = {
          body: {
            topic: 'Sample Meetup',
          }
        };
        const res = {};
        res.status = sinon.fake.returns(res);
        res.send = sinon.fake.returns(res);

        meetupController.createNewMeetup(req, res);

        res.status.firstCall.args[0].should.equal(400);
        res.send.firstCall.args[0].should.have.property('error');
        res.send.firstCall.args[0].error.should.deep.equal('The topic, location and happeningOn fields are required fields');
      });

      it('should not create meetup with data of the wrong type', () => {
        const req = {
          body: {
            topic: 'Sample Meetup',
            location: 'Sample Location',
            happeningOn: 'Tomorrow' // wrong data type
          }
        };
        const res = {};

        res.status = sinon.fake.returns(res);
        res.send = sinon.fake.returns(res);

        meetupController.createNewMeetup(req, res);

        res.status.firstCall.args[0].should.equal(422);
        res.send.firstCall.args[0].should.have.property('error');
        res.send.firstCall.args[0].error.should.equal('You provided an invalid meetup date');
      });

      it('should not create meetup with a past date', () => {
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

        const req = {
          body: {
            topic: 'Sample Meetup',
            location: 'Sample Location',
            happeningOn: yesterday
          }
        };
        const res = {};
        res.status = sinon.fake.returns(res);
        res.send = sinon.fake.returns(res);

        meetupController.createNewMeetup(req, res);

        res.status.firstCall.args[0].should.equal(422);
        res.send.firstCall.args[0].should.have.property('error');
        res.send.firstCall.args[0].error.should.deep.equal('Meetup Date provided is in the past, provide a future date');
      });
    });

    describe('handle valid user input', () => {
      it('should create a new meetup', () => {
        const req = {
          body: {
            topic: 'Sample Meetup',
            location: 'Sample Location',
            happeningOn: getFutureDate(10)
          }
        };
        const res = {};

        res.status = sinon.fake.returns(res);
        res.send = sinon.fake.returns(res);

        meetupController.createNewMeetup(req, res);

        res.status.firstCall.args[0].should.equal(201);
        res.send.firstCall.args[0].data.should.be.an('array');
        res.send.firstCall.args[0].data[0].should.have.property('topic');
        res.send.firstCall.args[0].data[0].topic.should.equal('Sample Meetup');
      });
    });
  });

  describe('Get a single meetup', () => {
    it('should retrieve a single meetup', () => {
      const req = {
        params: {
          meetupId: '2'
        }
      };
      const res = {};

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      meetupController.getSingleMeetup(req, res);

      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
      res.send.firstCall.args[0].data.should.be.an('array');
      res.send.firstCall.args[0].data.length.should.equal(1);
    });

    it('should return an error for a non-existent meetup', () => {
      const req = {
        params: {
          id: '9999999'
        }
      };
      const res = {};

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      meetupController.getSingleMeetup(req, res);

      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });

  describe('Get upcoming meetups', () => {
    it('should return all upcoming meetups', () => {
      const req = {};
      const res = {};

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);
      meetupController.getUpcomingMeetups(req, res);
      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].data.should.be.an('array');
    });
  });

  describe('Delete meetups', () => {
    it('should delete a meetup', () => {
      const req = {
        params: {
          meetupId: '3'
        }
      };

      const res = {};

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      meetupController.deleteMeetup(req, res);

      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].data.should.be.an('array');
      res.send.firstCall.args[0].data.length.should.equal(0);
    });

    it('should return an error for a non-existent meetup', () => {
      const req = {
        params: {
          id: '999999'
        }
      };

      const res = {};

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      meetupController.deleteMeetup(req, res);

      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });

  describe('Fetch all questions of a specific meetup', () => {
    it('should return a list of questions', () => {
      const req = {
        params: {
          meetupId: '2'
        }
      };

      const res = {};

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      meetupController.getQuestions(req, res);
      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
    });

    it('should return an error for no questions', () => {
      const req = {
        params: {
          id: '999999'
        }
      };

      const res = {};

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      meetupController.getQuestions(req, res);
      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });

  describe('Delete question in a meetup', () => {
    it('should delete a question asked in a meetup', () => {
      const req = {
        params: {
          meetupId: '4',
          questionId: '4'
        },

        body: {
          userId: '1'
        }
      };

      const res = {};

      res.send = sinon.fake.returns(res);
      res.status = sinon.fake.returns(res);

      meetupController.deleteMeetupQuestion(req, res);
      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
      res.send.firstCall.args[0].data.length.should.equal(0);
    });

    it('should return an error for a non-existing question', () => {
      const req = {
        params: {
          meetupId: '2',
          questionId: '999999'
        },

        body: {
          userId: '1'
        }
      };

      const res = {};

      res.send = sinon.fake.returns(res);
      res.status = sinon.fake.returns(res);

      meetupController.deleteMeetupQuestion(req, res);
      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });

  describe('Update Questions asked in a meetup', () => {
    it('should update a meetup question', () => {
      const req = {
        params: {
          meetupId: '1',
          questionId: '1'
        },

        body: {
          userId: '1'
        }
      };

      const res = {};

      res.send = sinon.fake.returns(res);
      res.status = sinon.fake.returns(res);

      meetupController.updateMeetupQuestion(req, res);
      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
      res.send.firstCall.args[0].data.length.should.equal(1);
    });

    it('should update a meetup question', () => {
      const req = {
        params: {
          meetupId: '2',
          questionId: '999999'
        },

        body: {
          userId: '1'
        }
      };

      const res = {};

      res.send = sinon.fake.returns(res);
      res.status = sinon.fake.returns(res);

      meetupController.updateMeetupQuestion(req, res);
      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });


  describe('Fetch a specific meetup question', () => {
    it('should return a meetup question record', () => {
      const req = {
        params: {
          meetupId: '3',
          questionId: '3'
        },
      };

      const res = {};

      res.send = sinon.fake.returns(res);
      res.status = sinon.fake.returns(res);

      meetupController.getSingleMeetupQuestion(req, res);

      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
    });

    it('should return a meetup question record', () => {
      const req = {
        params: {
          meetupId: '3',
          questionId: '9999999'
        },
      };

      const res = {};

      res.send = sinon.fake.returns(res);
      res.status = sinon.fake.returns(res);

      meetupController.getSingleMeetupQuestion(req, res);

      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });

  describe('Fetch all RSVPs of a meetup', () => {
    it('should return all RSVPs of a meetup', () => {
      const req = {
        params: {
          meetupId: '1',
        },
      };

      const res = {};

      res.send = sinon.fake.returns(res);
      res.status = sinon.fake.returns(res);

      meetupController.getAllRsvps(req, res);

      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
    });

    it('should return an error if there are no RSVPs for a meetup', () => {
      const req = {
        params: {
          meetupId: '9999999',
        },
      };

      const res = {};

      res.send = sinon.fake.returns(res);
      res.status = sinon.fake.returns(res);

      meetupController.getAllRsvps(req, res);

      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });
});
