import _ from 'lodash';
import db from '../db';
import { search } from './helpers/search';
import {
  sendResponse,
  sendServerErrorResponse,
  nullToEmptyArray,
  stripInnerNulls
} from './helpers';
import { arrayHasValues, objectHasProps, uniq } from '../utils';
import { Meetup, Image, Question } from '../models/all';

export default {
  async getAllMeetups(req, res) {
    try {
      if (objectHasProps(req.query)) {
        const { searchTerm } = req.query;

        const meetupResults = await db.queryDb({
          text: 'SELECT id, topic, location, happeningOn as "happeningOn", tags FROM Meetup'
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
      return sendServerErrorResponse(res);
    }
  },

  async createNewMeetup(req, res) {
    try {
      const {
        location, topic, happeningOn, tags = []
      } = req.body;

      const meetups = await Meetup.find({
        where: {
          location,
          happeningOn
        }
      });

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
      const images = [].concat(req.file.secure_url);

      const newMeetupQueryResult = await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn, tags, images)
               VALUES ($1, $2, $3, $4, $5) RETURNING topic, location, happeningOn as "happeningOn", tags`,
        values: [topic, location, happeningOn, uniqueTags, images]
      });

      let meetupResult = nullToEmptyArray(newMeetupQueryResult.rows);
      meetupResult = stripInnerNulls(newMeetupQueryResult.rows);

      const meetupRecord = meetupResult[0];

      return sendResponse({
        res,
        status: 201,
        payload: {
          status: 201,
          data: [meetupRecord]
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async getSingleMeetup(req, res) {
    try {
      const meetupQueryResult = await db.queryDb({
        text: `SELECT id, topic, location, happeningOn as "happeningOn", 
               tags FROM Meetup WHERE id=$1`,
        values: [req.params.meetupId]
      });

      const meetupRecord = meetupQueryResult.rows[0];

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
      return sendServerErrorResponse(res);
    }
  },

  async deleteMeetup(req, res) {
    try {
      const { meetupId } = req.params;
      const meetupRecord = await Meetup.findById(meetupId);

      if (meetupRecord) {
        const questions = await Question.find({ where: { meetup: 1 } });
        if (arrayHasValues(questions)) {
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
      return sendServerErrorResponse(res);
    }
  },

  async getUpcomingMeetups(req, res) {
    try {
      const meetupQueryResult = await db.queryDb({
        text: `SELECT id, topic as title, location, happeningOn as "happeningOn", tags FROM Meetup 
               WHERE happeningOn >= NOW()`
      });

      const upComingMeetups = meetupQueryResult.rows;

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
      return sendServerErrorResponse(res);
    }
  },

  async addTagsToMeetup(req, res) {
    try {
      const { meetupId } = req.params;
      const { tags = [] } = req.body;

      const meetupRecord = await Meetup.findById(meetupId);
      const MAX_TAGS_PER_MEETUP = 5;

      if (meetupRecord) {
        if (tags.length > MAX_TAGS_PER_MEETUP) {
          return sendResponse({
            res,
            status: 422,
            payload: {
              status: 422,
              error: 'You cannot add more than 5 tags to this meetup'
            }
          });
        }

        const newTags = meetupRecord.tags.concat(tags);

        const uniqueTags = uniq(newTags);

        const updateTagsQueryResult = await db.queryDb({
          text: `UPDATE Meetup
                 SET tags=$1
                 WHERE id=$2 RETURNING id as meetup,topic,tags`,
          values: [uniqueTags, meetupId]
        });

        const updatedMeetupRecord = updateTagsQueryResult.rows[0];

        return sendResponse({
          res,
          status: 201,
          payload: {
            status: 201,
            data: [updatedMeetupRecord]
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
      return sendServerErrorResponse(res);
    }
  },

  async getAllMeetupTags(req, res) {
    return res.status(404).send('Not Implemented');
  },

  async addImagesToMeetup(req, res) {
    try {
      const { meetupId } = req.params;

      const meetupRecord = await Meetup.findById(meetupId);

      if (meetupRecord) {
        req.files.forEach(async (file) => {
          await db.queryDb({
            text: `INSERT INTO Image (imageUrl, meetup)
                   VALUES ($1, $2)`,
            values: [file.secure_url, meetupId]
          });
        });

        const images = req.files.map(file => file.secure_url);
        const allImages = meetupRecord.images.concat(images);
        const uniqueImages = uniq(allImages);

        const updateImagesQueryResult = await db.queryDb({
          text: `UPDATE Meetup
                 SET images=$1
                 WHERE id=$2 RETURNING id as meetup, topic, images`,
          values: [uniqueImages, meetupId]
        });

        const updatedMeetupRecord = updateImagesQueryResult.rows[0];

        return sendResponse({
          res,
          status: 201,
          payload: {
            status: 201,
            data: [updatedMeetupRecord]
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'You cannot add images to this meetup because the meetup does not exist'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async getAllMeetupImages(req, res) {
    try {
      const { meetupId } = req.params;
      const meetupRecord = await Meetup.findById(meetupId);
      if (meetupRecord) {
        const meetupImages = await Image.find({ where: { meetup: meetupId } });

        if (meetupImages) {
          const images = meetupImages.map((image) => {
            image.imageUrl = image.imageurl;
            delete image.imageurl;
            return image;
          });
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
      return sendServerErrorResponse(res);
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
      return sendServerErrorResponse(res);
    }
  }
};
