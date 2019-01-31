import 'chai/register-should';
import jwt from 'jsonwebtoken';
import userHelpers from '../../../controllers/helpers/user';

describe('User Helpers', () => {
  let userHelper = null;
  before(() => {
    // db mock
    const db = {
      /* eslint-disable */
      queryDb(queryConfig) {
        return Promise.resolve({ encryptedPassword: 'password' });
      }
    };
    userHelper = userHelpers(db, jwt);
  });

  describe('Helper', () => {
    it('should return an object with methods', () => {
      userHelper.should.be.an('object');
      Object.keys(userHelper).length.should.equal(3);
    });
  });

  describe('obtainToken', () => {
    it('should return a token', () => {
      const token = userHelper.obtainToken({
        payload: {
          admin: false
        }
      });
      token.should.be.a('string');
      token.split('.').length.should.equal(3);
    });

    it('should return a token', () => {
      const token = userHelper.obtainToken({
        payload: {
          admin: false
        },

        expiresIn: '7d'
      });
      token.should.be.a('string');
      token.split('.').length.should.equal(3);
    });
  });

  describe('getUserPassword', () => {
    it('should return a user\'s password', async () => {
      const userPassword = await userHelper.getUserPassword({
        condition: 'username',
        value: 'dennisritchie'
      });

      const { encryptedPassword } = userPassword;
      encryptedPassword.should.be.a('string');
      encryptedPassword.should.equal('password');
    });

    it('should return a user\'s password', async () => {
      const userPassword = await userHelper.getUserPassword({
        condition: 'email',
        value: 'bob@email.com'
      });

      const { encryptedPassword } = userPassword;
      encryptedPassword.should.be.a('string');
      encryptedPassword.should.equal('password');
    });
  })

  describe('createUserError()', () => {
    it('should return an error object', () => {
      const userError = userHelper.createUserError('Password field cannot be empty');
      userError.should.be.instanceof(Error);
      userError.message.should.equal('Password field cannot be empty');
    });

    it('should return an error object', () => {
      const userError = userHelper.createUserError('The email you provided is already used by another user');
      userError.should.be.instanceof(Error);
      userError.message.should.equal('The email you provided is already used by another user');
    });
  })
})