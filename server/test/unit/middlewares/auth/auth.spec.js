import 'chai/register-should';
import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import Auth from '../../../../middlewares/auth';
import { createTestToken } from '../../../../utils';

describe('Auth Middlewares', () => {
  let testToken = '';
  let authHeader = null;
  let req = {};
  let res = {};

  before(() => {
    testToken = createTestToken({});

    authHeader = {
      authorization: `Bearer ${testToken}`,
      'access-token': testToken
    };

    req = httpMocks.createRequest({
      headers: {
        authorization: authHeader.authorization,
        'access-token': authHeader['access-token']
      }
    });

    res = httpMocks.createResponse();
  });

  describe('checkToken()', () => {
    describe('handle valid token', () => {
      it('should authenticate user with a valid token', () => {
        const next = sinon.spy();

        Auth.checkToken(req, res, next);

        req.decodedToken.should.be.an('object');
        req.decodedToken.should.have.property('admin');
        req.decodedToken.admin.should.equal(false);
        next.calledOnce.should.equal(true);
      });
    });

    describe('handle invalid token', () => {
      it('should not authenticate a user with no token', () => {
        const next = sinon.spy();

        testToken = '';

        req = httpMocks.createRequest({
          headers: {
            authorization: testToken,
            'access-token': testToken
          }
        });

        res = httpMocks.createResponse();
        Auth.checkToken(req, res, next);
        res.statusCode.should.equal(400);
        next.called.should.equal(false);
      });

      it('should not authenticate a user with an invalid (corrupted/expired) token', () => {
        const next = sinon.spy();
        testToken = 'chokolobamboshe.chokolobamboshechokolobamboshe.chokolobamboshe';

        req = httpMocks.createRequest({
          headers: {
            authorization: testToken,
            'access-token': testToken
          }
        });

        res = httpMocks.createResponse();
        Auth.checkToken(req, res, next);
        res.statusCode.should.equal(401);
        next.called.should.equal(false);
      });


      it('should not authenticate a user with an invalid (corrupted/expired) token', () => {
        const next = sinon.spy();
        testToken = 'chokolobamboshe.chokolobamboshechokolobamboshe.chokolobamboshe';

        req = httpMocks.createRequest({
          headers: {
            authorization: testToken,
            'access-token': testToken
          }
        });

        res = httpMocks.createResponse();
        Auth.checkToken(req, res, next);
        res.statusCode.should.equal(401);
        next.called.should.equal(false);
      });
    });
  });

  describe('isAdmin()', () => {
    it('should authorize an admin', () => {
      const req = httpMocks.createRequest({
        decodedToken: {
          admin: true
        }
      });
      const res = httpMocks.createResponse();
      const next = sinon.spy();

      Auth.isAdmin(req, res, next);
      next.called.should.equal(true);
    });

    it('should not authorize a non-admin', () => {
      const req = httpMocks.createRequest({
        decodedToken: {
          admin: false
        }
      });
      const res = httpMocks.createResponse();
      const next = sinon.spy();

      Auth.isAdmin(req, res, next);
      res.statusCode.should.equal(403);
      next.called.should.equal(false);
    });
  });
});
