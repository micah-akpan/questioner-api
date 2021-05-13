import uniqBy from 'lodash/uniqBy';
import { GraphQLScalarType } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Meetup } from '../models/all';
import { search } from '../controllers/helpers/search';
import uploadHelper from '../helpers/upload';

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
