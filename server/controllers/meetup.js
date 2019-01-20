import _ from 'lodash';
import db from '../db';
import { search } from './helpers/search';
import { sendResponse } from './helpers';
import { arrayHasValues, objectHasProps, uniq } from '../utils';

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
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request, please check request and try again'
        }
      });
    }
  },

  async createNewMeetup(req, res) {
    try {
      const {
        location, topic, happeningOn, tags
      } = req.body;

      const meetupByLocation = await db.queryDb({
        text: 'SELECT * FROM Meetup WHERE location=$1 AND happeningOn=$2',
        values: [location, happeningOn]
      });

      if (arrayHasValues(meetupByLocation.rows)) {
        return sendResponse({
          res,
          status: 409,
          payload: {
            status: 409,
            error: 'A meetup is scheduled on the same day at the same location'
          }
        });
      }

      if (tags.length > 5) {
        return sendResponse({
          res,
          status: 422,
          payload: {
            status: 422,
            error: 'You cannot add more than 5 tags to this meetup'
          }
        });
      }

      /* eslint-disable */
      // This parses the str and forms into a
      // a compatible postgres array insertion string
      let allTags = '{';
      tags.forEach((tag, i) => {
        if (i === tags.length - 1) {
          allTags += tag;
          allTags += '}';
        } else {
          allTags += tag;
          allTags += ', ';
        }
      })

      const uniqueTags = uniq(tags);

      const newMeetup = await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn, tags)
               VALUES ($1, $2, $3, $4) RETURNING topic, location, happeningOn, tags`,
        values: [topic, location, happeningOn, uniqueTags]
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
        status: 500,
        payload: {
          status: 500,
          data: 'Invalid request, please check request and try again'
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
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request, please check request and try again'
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
        const meetupRecord = results.rows[0];

        const questionsResult = await db.queryDb({
          text: 'SELECT * FROM Question WHERE meetup=$1',
          values: [meetupRecord.id]
        });

        if (arrayHasValues(questionsResult.rows)) {
          // there are questions of this meetup
          await db.queryDb({
            text: 'DELETE FROM Question WHERE meetup=$1',
            values: [meetupRecord.id]
          });
        }


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
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request, please check request and try again'
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
        status: 500,
        payload: {
          status: 500,
          error: 'Invalid request, please check request and try again'
        }
      });
    }
  },

  async addTagsToMeetup(req, res) {
    try {
      const meetupResult = await db.queryDb({
        text: 'SELECT * FROM Meetup WHERE id=$1',
        values: [req.params.meetupId]
      });

      const { tags } = req.body;

      if (meetupResult.rows.length > 0) {
        if (tags.length > 5) {
          return sendResponse({
            res,
            status: 422,
            payload: {
              status: 422,
              error: 'You cannot add more than 5 tags to this meetup'
            }
          });
        }
        const newTags = meetupResult.rows[0].tags
          .concat(tags)
          .filter(tag => tag !== null);

        /* eslint-disable */
        // This parses the str and forms into a
        // a compatible postgres array insertion string
        let allTags = '{';
        newTags.forEach((tag, i) => {
          if (i === newTags.length - 1) {
            allTags += tag;
            allTags += '}';
          } else {
            allTags += tag;
            allTags += ', ';
          }
        })

        const uniqueTags = uniq(newTags);

        const result = await db.queryDb({
          text: `UPDATE Meetup
                 SET tags=$1
                 WHERE id=$2 RETURNING id as meetup,topic,tags`,
          values: [uniqueTags, req.params.meetupId]
        });

        const meetupRecord = result.rows[0];

        const parsedTags = meetupRecord.tags.map(tag => (tag === null ? '' : tag));

        meetupRecord.tags = parsedTags;

        return sendResponse({
          res,
          status: 201,
          payload: {
            status: 201,
            data: [meetupRecord]
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'You cannot add tags to this meetup, because the meetup does not exist'
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

  async addImagesToMeetup(req, res) {
    try {
      const meetupResult = await db.queryDb({
        text: 'SELECT * FROM Meetup WHERE id=$1',
        values: [req.params.meetupId]
      });

      if (arrayHasValues(meetupResult.rows)) {
        if (req.files.length === 0) {
          return sendResponse({
            res,
            status: 422,
            payload: {
              status: 422,
              error: 'You must provide at least one image'
            }
          });
        }

        const [image1 = '', image2 = '', image3 = '', image4 = ''] = req.files;
        const images = `{${image1.url}, ${image2.url}, ${image3.url}, ${image4.url}}`;
        const result = await db.queryDb({
          text: `UPDATE Meetup
                 SET images=$1
                 WHERE id=$2 RETURNING id as meetup, topic, images`,
          values: [images, req.params.meetupId]
        });

        const meetupRecord = result.rows[0];
        const parsedImages = meetupRecord.images.map(image => (image === 'undefined' ? '' : image));

        meetupRecord.images = parsedImages;

        return sendResponse({
          res,
          status: 201,
          payload: {
            status: 201,
            data: [meetupRecord]
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'You cannot add images to this meetup, because the meetup does not exist'
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
  }
};
