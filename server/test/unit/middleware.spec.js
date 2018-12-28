import 'chai/register-should';
import sinon from 'sinon';
import schemaValidator from '../../middlewares/schemaValidator';

describe('Middlewares', () => {
  describe('Schema Validation Middleware', () => {
    describe('Question Schema Validation', () => {
      it('can validate question schema: incomplete data', () => {
        const res = {};
        const req = {
          method: 'POST',
          body: {
            title: '',
            body: ''
          },

          route: {
            path: '/questions'
          }
        };

        const next = sinon.spy();

        res.send = sinon.fake.returns(res);
        res.status = sinon.fake.returns(res);

        const middleware = schemaValidator();
        middleware(req, res, next);

        res.status.firstCall.args[0].should.equal(422);
        res.send.firstCall.args[0].should.have.property('error');

        next.called.should.be.false;
      });

      it('can validate question schema: complete data', () => {
        const res = {};
        const req = {
          method: 'POST',
          body: {
            title: 'some title',
            body: 'some body',
            meetupId: 1,
            userId: 1
          },

          route: {
            path: '/questions'
          }
        };

        const next = sinon.spy();

        res.send = sinon.fake.returns(res);
        res.status = sinon.fake.returns(res);

        const middleware = schemaValidator();
        middleware(req, res, next);

        next.calledOnce.should.be.true;
      });

      it('can validate question schema', () => {
        const res = {};
        const req = {
          method: 'POST',
          body: {
            title: 'some title',
            body: 'some body',
            userId: 1
          },

          route: {
            path: '/questions'
          }
        };

        const next = sinon.spy();

        res.send = sinon.fake.returns(res);
        res.status = sinon.fake.returns(res);

        const middleware = schemaValidator(true);
        middleware(req, res, next);

        res.status.firstCall.args[0].should.equal(422);
        res.send.firstCall.args[0].should.have.property('error');

        next.calledOnce.should.be.false;
      });
    });
  });
});
