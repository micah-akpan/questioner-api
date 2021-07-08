import { PutObjectCommand } from '@aws-sdk/client-s3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import shortId from 'shortid';
import { BASE_S3_URI } from '../../config';
import userHelpers from '../../controllers/helpers/user';
import DB from '../../db';
import { configClient, getUploadedStream } from '../../helpers/aws-s3-helper';

const userHelper = userHelpers(DB, jwt);

export default {
  async createMeetup(_, {
    topic, location, happeningOn, image,
  }, { meetupService }) {
    const when = new Date(happeningOn);
    // TODO: Set the constraints for no duplicate location and happeningOn at the
    // model level
    // Validate the total tags: max = 5
    // Move business logic to services

    const { filename, createReadStream } = await image;
    const fileNameKey = `${shortId.generate()}-${filename}`;

    const stream = createReadStream();
    stream.read();

    const client = configClient();
    const S3_BUCKET_DIRECTORY = 'images';

    try {
      const uploadedStream = await getUploadedStream(stream);

      await client.send(new PutObjectCommand({
        Bucket: 'questioner-storage',
        Key: `${S3_BUCKET_DIRECTORY}/${fileNameKey}`,
        Body: uploadedStream,
        ACL: 'public-read',
      }));

      const meetupImageUrl = `${BASE_S3_URI}/${S3_BUCKET_DIRECTORY}/${fileNameKey}`;

      const newMeetup = await meetupService.createMeetup({
        topic, place: location, date: when, image: meetupImageUrl
      });
      return newMeetup;
    } catch (err) {
      throw err;
    }
  },

  /* eslint-disable no-unused-vars */
  async createQuestion(_, { title, body, meetupId }, context) {
    return null;
  },

  async login(_, { email, password }, { db }) {
    const { rows } = await db.queryDb({
      text: `SELECT id, firstname, lastname, 
          email, password, othername, phonenumber as "phoneNumber",
          registered, isadmin as "isAdmin", birthday, bio FROM "User" 
          WHERE email=$1`,
      values: [email]
    });

    if (rows.length) {
      const user = rows[0];
      const encryptedPassword = user.password;

      const match = await bcrypt.compare(password, encryptedPassword);
      if (match) {
        const token = userHelper.obtainToken({
          payload: {
            admin: user.isAdmin,
            userId: user.id
          }
        });
        return {
          token,
          user
        };
      }
      throw new Error('Invalid password');
    }

    throw new Error('No such user found');
  },

  async signup(_, {
    firstname, lastname, password, email
  }, { db }) {
    const { rows } = await db.queryDb({
      text: 'SELECT  * FROM "User" WHERE email=$1',
      values: [email]
    });

    if (rows.length) {
      throw new Error('User already exist');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { rows: [newUser] } = await db.queryDb({
      text: `INSERT INTO "User" (email,password,firstname,lastname)
            VALUES ($1, $2, $3, $4) RETURNING id, firstname, lastname, 
            email, othername, phonenumber as "phoneNumber", registered,
            isadmin as "isAdmin", birthday, bio`,
      values: [email, passwordHash, firstname, lastname]
    });
    const token = userHelper.obtainToken({
      payload: {
        admin: newUser.isAdmin,
        userId: newUser.id
      }
    });
    return {
      token,
      newUser
    };
  },
};
