import _ from 'lodash';
import db from '../db';
import { search } from './helpers/search';
import { sendResponse } from './helpers';
import { arrayHasValues, objectHasProps } from '../utils';

export default {
  async getAllMeetups(req, res) {
    try {
      if (objectHasProps(req.query)) {
        const { searchTerm } = req.query;

        const meetups = await db.queryDb({
          text: 'SELECT * FROM Meetup'
        });

        const meetupRecords = meetups.rows;

        const byTopic = search(meetupRecords, 'topic', searchTerm);
        const byLocation = search(meetupRecords, 'location', searchTerm);
        const byTag = search(meetupRecords, 'tags', searchTerm);

        const allMeetups = [...byTopic, ...byLocation, ...byTag];

        const filteredMeetups = _.uniqBy(allMeetups, 'id');

        if (allMeetups.length) {
          return sendResponse({
            res,
            status: 200,
            payload: {
              status: 200,
              data: filteredMeetups
            }
          });
        }

        return sendResponse({
          res,
          status: 404,
          payload: {
            status: 404,
            error: `No meetups match with this search: ${req.query.searchTerm}`
          }
        });
      }
      const meetups = await db.queryDb({
        text: 'SELECT id, topic as title, location, happeningOn, tags FROM Meetup'
      });
      const meetupRecords = meetups.rows;
      return sendResponse({
        res,
        status: 200,
        payload: {
          status: 200,
          data: meetupRecords
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
    }
  },

  async createNewMeetup(req, res) {
    try {
      const {
        location, topic, happeningOn, tags
      } = req.body;

      const parsedTags = tags && tags.split(',');
      const MAX_TAGS = 5;
      const NULL = 'NULL';

      if (parsedTags && parsedTags.length > MAX_TAGS) {
        return sendResponse({
          res,
          status: 422,
          payload: {
            status: 422,
            error: 'You cannot add more than 5 tags to this meetup'
          }
        });
      }

      const [tag1 = NULL, tag2 = NULL, tag3 = NULL, tag4 = NULL, tag5 = NULL] = parsedTags;
      const newMeetup = await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn, tags)
               VALUES ($1, $2, $3, $4) RETURNING topic, location, happeningOn, tags`,
        values: [topic, location, happeningOn, `{ ${tag1}, ${tag2}, ${tag3}, ${tag4}, ${tag5}}`]
      });
      const meetupRecord = newMeetup.rows[0];

      return sendResponse({
        res,
        status: 201,
        payload: {
          status: 201,
          data: [meetupRecord]
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          data: 'Invalid request, please try again'
        }
      });
    }
  },

  async getSingleMeetup(req, res) {
    try {
      const result = await db.queryDb({
        text: 'SELECT id, topic, location, happeningOn, tags FROM Meetup WHERE id=$1',
        values: [req.params.meetupId]
      });

      const meetupRecord = result.rows[0];

      if (meetupRecord) {
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [meetupRecord]
          }
        });
      }
      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'The requested meetup does not exist'
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
    }
  },

  async deleteMeetup(req, res) {
    const { meetupId } = req.params;
    try {
      const results = await db.queryDb({
        text: 'SELECT * FROM Meetup WHERE id=$1',
        values: [meetupId]
      });

      if (arrayHasValues(results.rows)) {
        await db.queryDb({
          text: 'DELETE FROM Meetup WHERE id=$1',
          values: [meetupId]
        });

        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [`Meetup with the id: ${meetupId} has been deleted successfully`]
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'The meetup cannot be deleted because it doesn\'t exist.'
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request. Please check and try again'
        }
      });
    }
  },

  async getUpcomingMeetups(req, res) {
    try {
      const results = await db.queryDb({
        text: 'SELECT id, topic as title, location, happeningOn, tags FROM Meetup WHERE happeningOn >= NOW()'
      });

      const upComingMeetups = results.rows;

      if (arrayHasValues(upComingMeetups)) {
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: upComingMeetups
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'There are no upcoming meetups at the moment'
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'There are no upcoming meetups at the moment'
        }
      });
    }
  },
};
