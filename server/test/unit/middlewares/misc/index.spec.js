import 'chai/register-should';
import sinon from 'sinon';
import Misc from '../../../../middlewares/misc';

describe('Misc middleware', () => {
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
});
