import uniqBy from 'lodash/uniqBy';
import { GraphQLScalarType } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Meetup } from '../models/all';
import { search } from '../controllers/helpers/search';
import uploadHelper from '../helpers/upload';
import userHelpers from '../controllers/helpers/user';
import DB from '../db';

const userHelper = userHelpers(DB, jwt);

export default {
  Query: {
    async meetups(_, { searchTerm }, context) {
      // this should support pagination
      const { rows } = await context.db.queryDb({
        text: 'SELECT id, topic, location, happeningOn as "happeningOn", tags FROM Meetup'
      });
      const term = searchTerm || 'All';
      if (term === 'All') {
        return rows;
      }
      const byTopic = search(rows, 'topic', term);
      const byLocation = search(rows, 'location', term);
      const byTag = search(rows, 'tags', term);

      const allMeetups = [...byTopic, ...byLocation, ...byTag];
      const filteredMeetups = uniqBy(allMeetups, 'id');

      return filteredMeetups;
    },

    async questions(_, _args, { db }) {
      const { rows } = await db.queryDb({
        text: 'SELECT id, title, body, meetup, votes, createdby as user, createdon as "createdOn" FROM Question ORDER BY votes DESC'
      });
      return rows;
    }
  },

  Mutation: {
    async createMeetup(_, {
      topic, location, happeningOn, tags, imageUrl
    }, context) {
      const when = new Date(happeningOn);
      const meetups = await Meetup.find({
        where: {
          location,
          happeningOn
        }
      });

      if (meetups.length > 0) {
        throw new Error('A meetup is scheduled on the same day at the same location');
      }

      if (tags.length > 5) {
        throw new Error('You cannot add more than 5 tags to this meetup');
      }

      const { rows: [newMeetup] } = await context.db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
                   VALUES ($1, $2, $3) RETURNING id, topic, location, happeningOn`,
        values: [topic, location, when, [imageUrl]] || []
      });

      return newMeetup;
    },

    async uploadMeetupImage(_, args, context) {
      const file = await context.storeUpload(await args.avatar);
      const savedFile = await uploadHelper.uploadImage(file.path);
      return {
        id: file.id,
        filename: file.filename,
        mimetype: file.mimetype,
        path: savedFile.secure_url
      };
    },

    /* eslint-disable no-unused-vars */
    async createQuestion(_, { title, body, meetupId }, context) {
      console.log('req user: ', context.req.user);
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
    }
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'UTC number of milliseconds since midnight Jan 1 1970 as in JS date',
    parseValue(value) {
      return new Date(value);
    },

    serialize(value) {
      // Convert Date to number primitive .getTime() or .valueOf()
      // value sent to the client
      return value instanceof Date ? value.valueOf() : value;
    },
  }),

  Upload: GraphQLUpload
};
