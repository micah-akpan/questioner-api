import 'chai/register-should';
import sinon from 'sinon';
import rsvpController from '../../controllers/rsvp';

describe('RSVP Meetup API', () => {
  describe('Make RSVP /meetups/:id/rsvps', () => {
    describe('handle valid data', () => {
      it('should make rsvp for a meetup', () => {
        const req = {
          params: {
            id: '1'
          },

          body: {
            response: 'yes',
            userId: 1
          }
        };

        const res = {};

        res.status = sinon.fake.returns(res);
        res.send = sinon.fake.returns(res);

        rsvpController.makeRsvp(req, res);
        res.status.firstCall.args[0].should.equal(201);
        res.send.firstCall.args[0].data[0].should.have.property('topic');
      });
    });

    describe('handle invalid data', () => {
      it('should not make rsvp for a meetup that doesn\'t exist', () => {
        const req = {
          params: {
            id: '9999999'
          }
        };

        const res = {};

        res.status = sinon.fake.returns(res);
        res.send = sinon.fake.returns(res);

        rsvpController.makeRsvp(req, res);
        res.status.firstCall.args[0].should.equal(404);
        res.send.firstCall.args[0].should.have.property('error');
      });
    });
  });
});
