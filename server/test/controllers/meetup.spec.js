import 'chai/register-should';
import sinon from 'sinon';
import meetupController from '../../controllers/meetup';

describe('Meetup Controller', () => {
  describe('#getUpcomingMeetups', () => {
    it('should be a function', () => {
      meetupController.getUpcomingMeetups.should.be.a('function');
    });

    it('should fetch upcoming meetups', () => {
      const res = {};
      const req = {};

      const sendStub = sinon.stub().returns(res);
      const statusStub = sinon.stub().returns(res);

      res.status = statusStub;
      res.send = sendStub;

      meetupController.getUpcomingMeetups(req, res);

      res.status.calledOnce.should.be.true;
      res.send.calledOnce.should.be.true;
    });
  });
});
