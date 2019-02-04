import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import { sendResponse } from './helpers';
import { arrayHasValues, replaceNullValue, omitProps } from '../utils';
import userHelpers from './helpers/user';

const userHelper = userHelpers(db, jwt);

export default {
  /**
   * @func signUpUser
   * @param {*} req
   * @param {*} res
   * @returns {*}  JSON object indicating a successful or failed sign up request
   */
  async signUpUser(req, res) {
    try {
      const {
        email, password, firstname, lastname,
      } = req.body;

      const userByEmailResult = await db.queryDb({
        text: 'SELECT  * FROM "User" WHERE email=$1',
        values: [email]
      });

      if (arrayHasValues(userByEmailResult.rows)) {
        // user exist
        return sendResponse({
          res,
          status: 409,
          payload: {
            status: 409,
            error: 'The email you provided is already used by another user'
          }
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newTableResult = await db.queryDb({
        text: `INSERT INTO "User" (email,password,firstname,lastname)
                         VALUES ($1, $2, $3, $4) RETURNING id, firstname, lastname, 
                         email, othername, phonenumber as "phoneNumber", registered,
                         isadmin as "isAdmin", birthday, bio`,
        values: [email, hashedPassword, firstname, lastname]
      });
      const userRecord = replaceNullValue(newTableResult.rows[0], '');

      const userAuthToken = userHelper.obtainToken({
        payload: {
          admin: userRecord.isAdmin,
          userId: userRecord.id
        }
      });
      return sendResponse({
        res,
        status: 201,
        payload: {
          status: 201,
          data: [{
            token: userAuthToken,
            user: userRecord
          }]
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request, please check request and try again'
        }
      });
    }
  },

  /**
   * @func loginUser
   * @param {Request} req
   * @param {Response} res
   * @returns {*} JSON object indicating a successful or failed request
   */
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const userResult = await db.queryDb({
        text: `SELECT id, firstname, lastname, 
            email, othername, phonenumber as "phoneNumber",
            registered, isadmin as "isAdmin", birthday, bio FROM "User" 
            WHERE email=$1`,
        values: [email]
      });

      if (arrayHasValues(userResult.rows)) {
        // user with this email exist
        const result = await userHelper.getUserPassword({ condition: 'email', value: email });
        const { encryptedpassword } = result.rows[0];

        const match = await bcrypt.compare(password, encryptedpassword);

        const userRecord = replaceNullValue(userResult.rows[0], '');

        const userAuthToken = userHelper.obtainToken({
          payload: {
            admin: userRecord.isAdmin,
            userId: userRecord.id
          }
        });

        if (match) {
          return sendResponse({
            res,
            status: 201,
            payload: {
              status: 201,
              data: [{
                token: userAuthToken,
                user: userRecord
              }]
            }
          });
        }
        return sendResponse({
          res,
          status: 401,
          payload: {
            status: 401,
            error: 'You entered an incorrect password, please check and try again'
          }
        });
      }

      return sendResponse({
        res,
        status: 401,
        payload: {
          status: 401,
          error: 'The email you entered does not belong to any account'
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request, please check request and try again'
        }
      });
    }
  },

  async getUser(req, res) {
    try {
      const usersResult = await db.queryDb({
        text: 'SELECT * FROM "User" WHERE id=$1',
        values: [req.params.userId]
      });

      if (arrayHasValues(usersResult.rows)) {
        const records = usersResult.rows
          .map(row => replaceNullValue(row))
          .map(row => omitProps(row, ['password']))
          .map((row) => {
            row.phoneNumber = row.phonenumber;
            row.isAdmin = row.isadmin;
            delete row.phonenumber;
            delete row.isadmin;
            return row;
          });

        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: records
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'This user does not exist at the moment'
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request. Please try again'
        }
      });
    }
  },

  async getAllUsers(req, res) {
    try {
      /* eslint-disable */
      const usersResult = await db.queryDb({
        text: 'SELECT * FROM "User" WHERE isAdmin=FALSE'
      });

      if (arrayHasValues(usersResult.rows)) {
        const users = usersResult.rows
          .map(row => replaceNullValue(row))
          .map(row => omitProps(row, ['password']))
          .map(row => {
            row.isAdmin = row.isadmin;
            row.phoneNumber = row.phonenumber;
            delete row.isadmin;
            delete row.phonenumber;
            return row;
          })
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: users
          }
        })
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'No registered users at the moment'
        }
      })
    } catch (e) {
      return sendResponse({
        res,
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request, please check request and try again'
        }
      })
    }
  },

  async updateUserProfile(req, res) {
    try {
      const {
        firstname, lastname, email,
        password, username, birthday, othername,
        phoneNumber, bio
      } = req.body;

      const { userId } = req.decodedToken || req.body;

      if (userId !== Number(req.params.userId)) {
        return sendResponse({
          res,
          status: 422,
          payload: {
            status: 422,
            error: 'You can only update your own personal data'
          }
        })
      }

      // enforcing unique usernames
      // at the controller level
      const userByUsernameResult = await db.queryDb({
        text: 'SELECT * FROM "User" WHERE username=$1 AND id <> $2',
        values: [username, userId]
      });

      if (arrayHasValues(userByUsernameResult.rows)) {
        return sendResponse({
          res,
          status: 409,
          payload: {
            status: 409,
            error: 'The username you provided is already used by another user'
          }
        })
      }

      const userByIdResult = await db.queryDb({
        text: 'SELECT * FROM "User" WHERE id=$1',
        values: [userId]
      });

      if (arrayHasValues(userByIdResult.rows)) {
        const user = userByIdResult.rows[0];

        const encryptedPassword = password && await bcrypt.hash(password, 10);

        const userData = {
          firstname: firstname || user.firstname,
          lastname: lastname || user.lastname,
          email: email || user.email,
          password: encryptedPassword || user.password,
          username: username || user.username,
          othername: othername || user.othername,
          birthday: birthday || user.birthday,
          phoneNumber: phoneNumber || user.phonenumber,
          bio: bio || user.bio,
          avatar: req.file && req.file.secure_url || user.avatar
        };

        const updateUserResult = await db.queryDb({
          text: `UPDATE "User"
                 SET firstname=$1,lastname=$2, email=$3,
                     password=$4, username=$5, birthday=$6,
                     othername=$7, phoneNumber=$8, bio=$9, avatar=$10
                 WHERE id=$11 RETURNING id, firstname, lastname,
                 email, phoneNumber as "phoneNumber", othername,
                 username, isadmin as "isAdmin", birthday, bio, avatar`,
          values: [userData.firstname, userData.lastname, userData.email,
          userData.password, userData.username, userData.birthday,
          userData.othername, userData.phoneNumber, userData.bio,
          userData.avatar, userId]
        });

        const userRecord = replaceNullValue(updateUserResult.rows[0], '');

        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [userRecord]
          }
        })
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'This user does not have an account'
        }
      })
    } catch (e) {
      return sendResponse({
        res,
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request, please check request and try again'
        }
      })
    }
  },

  async deleteUser(req, res) {
    try {
      const { userId } = req.decodedToken || req.body;

      const result = await db.queryDb({
        text: 'SELECT * FROM "User" WHERE id=$1',
        values: [userId]
      });

      if (arrayHasValues(result.rows)) {
        if (userId !== Number(req.params.userId)) {
          return sendResponse({
            res,
            status: 422,
            payload: {
              status: 422,
              error: 'You can only deactivate your own account'
            }
          })
        }

        await db.queryDb({
          text: 'DELETE FROM "User" WHERE id=$1',
          values: [req.params.userId]
        });

        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [`User account has been deactivated successfully`]
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: `A user with this account does not exist`
        }
      });

    } catch (e) {
      return sendResponse({
        res,
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request. Please check request and try again'
        }
      });
    }
  }
};
