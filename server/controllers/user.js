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
          error: 'A user with this email already exists'
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
  }
};
