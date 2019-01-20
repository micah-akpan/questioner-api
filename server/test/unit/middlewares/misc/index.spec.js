import 'chai/register-should';
import sinon from 'sinon';
import Misc from '../../../../middlewares/misc';

describe.only('Misc middleware', () => {
  describe('trimBody()', () => {
    it('should trim request body', () => {
      const req = {
        body: {}
      };

      const res = {};
      const next = sinon.spy();

      Misc.trimBody(req, res, next);
      next.calledOnce.should.be.true;
    });

    it('should trim request body', () => {
      const req = {
        body: {
          title: '        hello ',
        }
      };

      const res = {};
      const next = sinon.spy();

      Misc.trimBody(req, res, next);
      req.body.title.should.equal('hello');
      next.calledOnce.should.be.true;
    });
  });

  describe('allowValues()', () => {
    it('should only allow enum values', () => {
      const req = {
        body: {
          response: 'g'
        }
      };
      const res = {};
      const next = sinon.spy();

      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      const allowedValues = ['a', 'b', 'c'];
      const middleware = Misc.allowOnly(allowedValues);
      middleware(req, res, next);

      res.status.calledOnce.should.be.true;
      res.status.firstCall.args[0].should.equal(400);
    });
  });
});
