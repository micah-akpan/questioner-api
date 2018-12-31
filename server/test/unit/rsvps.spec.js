import 'chai/register-should';
import sinon from 'sinon';
import rsvpController from '../../controllers/rsvp';

describe('RSVP Meetup API', () => {
  describe('Make RSVP', () => {
    describe('handle valid data', () => {
      it('should make rsvp for a meetup', () => {
        const req = {
          params: {
            meetupId: '1'
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

  describe('Update RSVP', () => {
    it('should update an existing RSVP', () => {
      const req = {
        body: {
          response: 'yes'
        },

        params: {
          meetupId: '1',
          rsvpId: '1'
        }
      };

      const res = {};

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      rsvpController.updateRsvp(req, res);
      res.status.calledOnce.should.be.true;
      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].data[0].response.should.equal('yes');
    });

    it('should return an error for a non-existing RSVP', () => {
      const req = {
        body: {
          response: 'yes'
        },

        params: {
          meetupId: '1',
          rsvpId: '9999999'
        }
      };

      const res = {};

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      rsvpController.updateRsvp(req, res);
      res.status.calledOnce.should.be.true;
      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });
});
