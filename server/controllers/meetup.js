import _ from 'lodash';
import db from '../db';
import { search } from './helpers/search';
import { sendResponse } from './helpers';
import { arrayHasValues, objectHasProps, uniq } from '../utils';
import RecordTransformer from './helpers/RecordTransformer';
import { Meetup, Image, Question } from '../models/all';

export default {
  async getAllMeetups(req, res) {
    try {
      if (objectHasProps(req.query)) {
        const { searchTerm } = req.query;

        const meetupResults = await db.queryDb({
          text: 'SELECT id, topic, location, happeningOn as "happeningOn", tags, images FROM Meetup'
        });

        const meetupRecords = meetupResults.rows;

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
            error: `No meetups match with this search: ${searchTerm}`
          }
        });
      }
      const meetupResults = await db.queryDb({
        text: 'SELECT id, topic as title, location, happeningOn as "happeningOn", tags, images FROM Meetup'
      });
      const meetups = meetupResults.rows;

      return sendResponse({
        res,
        status: 200,
        payload: {
          status: 200,
          data: meetups
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

      const meetupByLocationResult = await Meetup.find({ location, happeningOn }, 'AND');
      const meetups = meetupByLocationResult.rows;

      if (arrayHasValues(meetups)) {
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

      const uniqueTags = uniq(tags);

      const newMeetup = await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn, tags)
               VALUES ($1, $2, $3, $4) RETURNING topic, location, happeningOn as "happeningOn", tags`,
        values: [topic, location, happeningOn, uniqueTags]
      });

      let meetup = RecordTransformer.transform(newMeetup.rows, 'tags', 'nulls-to-empty-array');

      meetup = RecordTransformer.transform(newMeetup.rows, 'tags', 'inner-nulls-with-empty-string');

      const meetupRecord = meetup[0];

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
        text: `SELECT id, topic, location, happeningOn as "happeningOn", 
               tags FROM Meetup WHERE id=$1`,
        values: [req.params.meetupId]
      });
      const meetups = RecordTransformer.transform(result.rows, 'tags', 'nulls-to-empty-array');
      const meetupRecord = meetups[0];

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
      const meetupResults = await Meetup.findById(meetupId);
      const meetupRecord = meetupResults.rows[0];

      if (meetupRecord) {
        const questionsResult = await Question.find({ meetup: 1 });
        const questions = questionsResult.rows;
        if (arrayHasValues(questions)) {
          // There are questions of this meetup
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
        text: `SELECT id, topic as title, location, happeningOn, tags FROM Meetup 
               WHERE happeningOn >= NOW()`
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
      const { meetupId } = req.params;
      const meetupResult = await Meetup.findById(meetupId);
      const meetup = meetupResult.rows[0];

      const { tags } = req.body;

      if (meetup) {
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

        meetup.tags = meetup.tags === null ? [] : meetup.tags;
        const newTags = meetup.tags.concat(tags);

        const uniqueTags = uniq(newTags);

        const result = await db.queryDb({
          text: `UPDATE Meetup
                 SET tags=$1
                 WHERE id=$2 RETURNING id as meetup,topic,tags`,
          values: [uniqueTags, meetupId]
        });

        const meetupRecord = result.rows[0];

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
      const { meetupId } = req.params;

      const meetupResult = await Meetup.findById(meetupId);
      const meetups = meetupResult.rows;
      if (arrayHasValues(meetups)) {
        req.files.forEach(async (file) => {
          await db.queryDb({
            text: `INSERT INTO Image (imageUrl, meetup)
                   VALUES ($1, $2)`,
            values: [file.secure_url, meetupId]
          });
        });

        const images = req.files.map(file => file.secure_url);

        const result = await db.queryDb({
          text: `UPDATE Meetup
                 SET images=$1
                 WHERE id=$2 RETURNING id as meetup, topic, images`,
          values: [images, meetupId]
        });

        const meetupRecord = result.rows[0];

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
  },

  async getAllMeetupTags(req, res) {
    return res.status(404).send('Not Implemented');
  },

  async getAllMeetupImages(req, res) {
    try {
      const { meetupId } = req.params;
      const meetupByIdResult = await Meetup.findById(meetupId);
      if (arrayHasValues(meetupByIdResult.rows)) {
        const meetupImagesResult = await Image.find({ meetup: meetupId });
        const images = meetupImagesResult.rows;

        if (arrayHasValues(images)) {
          return sendResponse({
            res,
            status: 200,
            payload: {
              status: 200,
              data: images
            }
          });
        }

        return sendResponse({
          res,
          status: 404,
          payload: {
            status: 404,
            error: 'There are no images for this meetup at the moment'
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'This meetup does not exist'
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

  async getSingleMeetupImage(req, res) {
    try {
      const { meetupId, imageId } = req.params;
      const meetupExist = await Meetup.recordExist(meetupId);
      if (meetupExist) {
        const imageResult = await db.queryDb({
          text: 'SELECT * FROM Image WHERE id=$1',
          values: [imageId]
        });
        const image = imageResult.rows[0];
        if (image) {
          return sendResponse({
            res,
            status: 200,
            payload: {
              status: 200,
              data: [image]
            }
          });
        }

        return sendResponse({
          res,
          status: 404,
          payload: {
            status: 404,
            error: 'The meetup image does not exist'
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
  }
};
