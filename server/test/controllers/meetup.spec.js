import 'chai/register-should';
import sinon from 'sinon';
import meetupController from '../../controllers/meetup';

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
          status() {},
          send() {}
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
          status() {},
          send() {}
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
          status() {},
          send() {}
        };

        res.status = sinon.stub(res, 'status').returns(res);
        res.send = sinon.stub(res, 'send').returns(res);
        meetupController.createNewMeetup(req, res);

        res.status.firstCall.args[0].should.equal(422);
        res.send.firstCall.args[0].should.have.property('error');
        res.send.firstCall.args[0].error.should.deep.equal('You provided an invalid meetup date ');
      });
    });
  });
});
