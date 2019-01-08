import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import { omitProps } from '../utils';

export default {
  async signUpUser(req, res) {
    const {
      email, password, firstname, lastname
    } = req.body;

    const getUserQuery = {
      text: 'SELECT * FROM "User" WHERE email=$1',
      values: [email]
    };

    try {
      const result = await db.queryDb(getUserQuery);
      if (result.rows.length > 0) {
        // user exist
        return res.status(422).send({
          status: 422,
          error: 'A user with this email already exist'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const createNewUserQuery = {
        text: `INSERT INTO "User" (email,password,firstname,lastname)
                         VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [email, hashedPassword, firstname, lastname]
      };

      const userAuthToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      const newTableResult = await db.queryDb(createNewUserQuery);
      return res.status(201).send({
        status: 201,
        data: [{
          token: userAuthToken,
          user: omitProps(newTableResult.rows[0], ['password'])
        }]
      });
    } catch (e) {
      return res.status(400).send({
        status: 400,
        error: 'Invalid request, please check your email and try again'
      });
    }
  },

  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const userResult = await db.queryDb({
        text: 'SELECT * FROM "User" WHERE email=$1',
        values: [email]
      });

      if (userResult.rows.length > 0) {
        // user exist
        const checkPwdQuery = {
          text: 'SELECT password as encryptedPassword FROM "User" WHERE email=$1',
          values: [email]
        };

        const result = await db.queryDb(checkPwdQuery);
        const { encryptedpassword } = result.rows[0];

        const match = await bcrypt.compare(password, encryptedpassword);

        if (match) {
          return res.status(201)
            .send({
              status: 201,
              data: [{
                token: jwt.sign({ email }, process.env.JWT_SECRET, {
                  expiresIn: '24h'
                }),
                user: omitProps(userResult.rows[0], ['password'])
              }]
            });
        }
        throw new Error('You entered an incorrect password, please check and try again');
      } else {
        throw new Error('A user with this email does not exist. Please check and try again. you can create an account at: http://localhost:9999/api/v2/auth/signup');
      }
    } catch (e) {
      return res.status(422)
        .send({
          status: 422,
          error: e.message
        });
    }
  }
};
