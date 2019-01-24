import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import { arrayHasValues, replaceNullValue } from '../utils';
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
        return res.status(409)
          .send({
            status: 409,
            error: 'The email you provided is already used by another user'
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
      return res.status(201).send({
        status: 201,
        data: [{
          token: userAuthToken,
          user: userRecord
        }]
      });
    } catch (e) {
      return res.status(500)
        .send({
          status: 500,
          error: 'Invalid request, please check request and try again'
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
            registered, isadmin as "isAdmin", birthday bio FROM "User" 
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
          return res.status(201)
            .send({
              status: 201,
              data: [{
                token: userAuthToken,
                user: userRecord
              }]
            });
        }
        return res.status(401)
          .send({
            status: 401,
            error: 'You entered an incorrect password, please check and try again'
          });
      }

      return res.status(401)
        .send({
          status: 401,
          error: 'The email you entered does not belong to any account.'
        });
    } catch (e) {
      return res.status(500)
        .send({
          status: 500,
          error: 'Invalid request, please check and try again'
        });
    }
  },

  async getUser(req, res) {
    return res.status(404).send('Not implemented');
  },

  async getAllUsers(req, res) {
    return res.status(404).send('Not implemented');
  },

  async updateUserProfile(req, res) {
    try {
      const {
        firstname, lastname, email,
        password, username, birthday, othername,
        phoneNumber, bio
      } = req.body;

      const { userId } = req.decodedToken || req.body;

      const userResult = await db.queryDb({
        text: 'SELECT * FROM "User" WHERE id=$1',
        values: [userId]
      });

      if (userResult.rows.length === 1) {
        const user = userResult.rows[0];
        const encryptedPassword = await bcrypt.hash(password, 10);
        const updateUserResult = await db.queryDb({
          text: `UPDATE "User"
                 SET firstname=$1,lastname=$2, email=$3,
                     password=$4, username=$5, birthday=$6,
                     othername=$7, phoneNumber=$8, bio=$9
                 WHERE id=$10 RETURNING id, firstname, lastname,
                 email, phoneNumber as "phoneNumber", othername,
                 username, isadmin as "isAdmin", birthday, bio`,
          values: [firstname || user.firstname, lastname
            || user.firstname, email || user.email,
          encryptedPassword || user.password, username || user.username,
          birthday || user.birthday, othername || user.othername,
          phoneNumber || user.phonenumber, bio || user.bio, userId]
        });

        const userRecord = replaceNullValue(updateUserResult.rows[0], '');

        return res.status(200).send({
          status: 200,
          data: [userRecord]
        });
      }

      return res.status(404)
        .send({
          status: 404,
          error: 'This user does not have an account'
        });
    } catch (e) {
      return res.status(500)
        .send({
          status: 500,
          error: 'Invalid request, please try again'
        });
    }
  }
};
