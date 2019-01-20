import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import { omitProps, arrayHasValues } from '../utils';
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
                         VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [email, hashedPassword, firstname, lastname]
      });
      const userRecord = newTableResult.rows[0];

      const userAuthToken = userHelper.obtainToken({
        payload: {
          admin: userRecord.isadmin,
          userId: userRecord.id
        }
      });

      return res.status(201).send({
        status: 201,
        data: [{
          token: userAuthToken,
          user: omitProps(newTableResult.rows[0], ['password'])
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
        text: 'SELECT * FROM "User" WHERE email=$1',
        values: [email]
      });

      if (arrayHasValues(userResult.rows)) {
        // user with this email exist
        const result = await userHelper.getUserPassword({ condition: 'email', value: email });
        const { encryptedpassword } = result.rows[0];

        const match = await bcrypt.compare(password, encryptedpassword);

        const userRecord = userResult.rows[0];

        const userAuthToken = userHelper.obtainToken({
          payload: {
            admin: userRecord.isadmin,
            userId: userRecord.id
          }
        });

        if (match) {
          return res.status(201)
            .send({
              status: 201,
              data: [{
                token: userAuthToken,
                user: omitProps(userResult.rows[0], ['password'])
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
          error: 'Your email is incorrect'
        });
    } catch (e) {
      return res.status(500)
        .send({
          status: 500,
          error: 'Invalid request, please check your email and try again'
        });
    }
  }
};
