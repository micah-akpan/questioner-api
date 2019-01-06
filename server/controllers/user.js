import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';

export default {
  async signUpUser(req, res) {
    const {
      email, password, firstname, lastname
    } = req.body;

    const getUserQuery = {
      text: 'SELECT * FROM Users WHERE email=$1',
      values: [email]
    };

    try {
      const result = await db.queryDb(getUserQuery);
      if (result.rows.length > 0) {
        // user exist
        res.status(422).send({
          status: 422,
          error: 'A user with this email already exist'
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createNewUserQuery = {
          text: `INSERT INTO Users(email,password,firstname,lastname)
                         VALUES ($1, $2, $3, $4) RETURNING *`,
          values: [email, hashedPassword, firstname, lastname]
        };

        const userAuthToken = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: '24h'
        });

        const newTableResult = await db.queryDb(createNewUserQuery);
        res.status(201).send({
          status: 201,
          data: [{
            token: userAuthToken,
            user: newTableResult.rows[0]
          }]
        });
      }
    } catch (e) {
      res.status(400).send({
        status: 400,
        error: e.toString()
      });
    }
  },

  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const userResult = await db.queryDb({
        text: 'SELECT * FROM Users WHERE email=$1',
        values: [email]
      });

      if (userResult.rows.length > 0) {
        // user exist
        const checkPwdQuery = {
          text: 'SELECT password as encryptedPassword FROM Users WHERE email=$1',
          values: [email]
        };

        const result = await db.queryDb(checkPwdQuery);
        const { encryptedpassword } = result.rows[0];

        const match = await bcrypt.compare(password, encryptedpassword);

        if (match) {
          res.status(200)
            .send({
              status: 200,
              data: [{
                token: jwt.sign({ email }, process.env.JWT_SECRET, {
                  expiresIn: '24h'
                }),
                user: userResult.rows[0]
              }]
            });
        } else {
          throw new Error('You entered an incorrect password, please check and try again');
        }
      } else {
        throw new Error('Incorrect email or password. Please check and try again');
      }
    } catch (e) {
      res.status(422)
        .send({
          status: 422,
          error: e.message
        });
    }
  }
};
