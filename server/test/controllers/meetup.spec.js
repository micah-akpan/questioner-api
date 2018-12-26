import 'chai/register-should';
import sinon from 'sinon';
import meetupController from '../../controllers/meetup';
import { getFutureDate } from '../../utils';

describe('Meetups API', () => {
  describe('Get all meetups', () => {
    it('should fetch meetups', () => {
      const res = {
        status() { },
        send() { }
      };
      const req = {};

      res.status = sinon.stub(res, 'status').returns(res);
      res.send = sinon.stub(res, 'send').returns(res);

      meetupController.getAllMeetups(req, res);

      res.status.calledOnce.should.be.true;
      res.send.calledOnce.should.be.true;

      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].status.should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
      res.send.firstCall.args[0].data.should.be.an('array');
    });
  });

  describe('Create Meetup', () => {
    describe('handle invalid user input', () => {
      it('should not create meetup with incomplete data', () => {
        const req = {
          body: {}
        };
        const res = {
          status() { },
          send() { }
        };

        res.status = sinon.stub(res, 'status').returns(res);
        res.send = sinon.stub(res, 'send').returns(res);
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
        const res = {
          status() { },
          send() { }
        };

        res.status = sinon.stub(res, 'status').returns(res);
        res.send = sinon.stub(res, 'send').returns(res);
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
        const res = {
          status() { },
          send() { }
        };

        res.status = sinon.stub(res, 'status').returns(res);
        res.send = sinon.stub(res, 'send').returns(res);
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
        const res = {
          status() { },
          send() { }
        };

        res.status = sinon.stub(res, 'status').returns(res);
        res.send = sinon.stub(res, 'send').returns(res);
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
        const res = {
          status() { },
          send() { }
        };

        res.status = sinon.stub(res, 'status').returns(res);
        res.send = sinon.stub(res, 'send').returns(res);
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
          id: '2'
        }
      };
      const res = {
        status() { },
        send() { }
      };

      res.status = sinon.stub(res, 'status').returns(res);
      res.send = sinon.stub(res, 'send').returns(res);

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
      const res = {
        status() { },
        send() { }
      };

      res.status = sinon.stub(res, 'status').returns(res);
      res.send = sinon.stub(res, 'send').returns(res);

      meetupController.getSingleMeetup(req, res);

      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });
});
