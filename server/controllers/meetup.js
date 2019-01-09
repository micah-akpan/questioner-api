import _ from 'lodash';
import db from '../db';
import { omitProps, getIndex } from '../utils';
import { search } from './helpers/search';

export default {

  /* eslint-disable no-undef */
  async getAllMeetups(req, res) {
    try {
      if (Object.keys(req.query).length) {
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
          return res.status(200)
            .send({
              status: 200,
              data: filteredMeetups
            });
        }

        return res.status(404).send({
          status: 404,
          error: `No meetups match with this search: ${req.query.searchTerm}`
        });
      }


      try {
        const meetups = await db.queryDb({
          text: 'SELECT * FROM Meetup'
        });
        const meetupRecords = meetups.rows
          .map(meetup => omitProps(meetup, ['images', 'createdOn', 'maxNumberOfAttendees']))
          .map((meetup) => {
            meetup.title = meetup.topic;
            delete meetup.topic;
            return meetup;
          });

        return res.status(200).send({
          status: 200,
          data: meetupRecords
        });
      } catch (e) {
        return res.status(400)
          .send({
            status: 400,
            error: 'Invalid request, please try again'
          });
      }
    } catch (e) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
        });
    }
  },

  async createNewMeetup(req, res) {
    const {
      location, topic, happeningOn
    } = req.body;

    try {
      const newMeetup = await db.queryDb({
        text: `INSERT INTO Meetup (topic, location, happeningOn)
               VALUES ($1, $2, $3) RETURNING *`,
        values: [topic, location, happeningOn]
      });

      const meetupRecord = omitProps(newMeetup.rows[0], ['createdOn', 'images', 'id', 'maxNumberOfAttendees']);

      return res.status(201)
        .send({
          status: 201,
          data: [meetupRecord]
        });
    } catch (e) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
        });
    }
  },

  async getSingleMeetup(req, res) {
    try {
      const result = await db.queryDb({
        text: 'SELECT * FROM Meetup WHERE id=$1',
        values: [req.params.meetupId]
      });

      const meetupRecord = result.rows[0];

      if (meetupRecord) {
        const mRecord = omitProps(meetupRecord, ['createdOn', 'images', 'maxNumberofAttendees']);

        return res.status(200)
          .send({
            status: 200,
            data: [mRecord]
          });
      }

      return res.status(404)
        .send({
          status: 404,
          error: 'The requested meetup does not exist'
        });
    } catch (e) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
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

      if (results.rows.length === 0) {
        return res.status(404)
          .send({
            status: 404,
            error: 'The meetup cannot be deleted because it doesn\'t exist.'
          });
      }

      await db.queryDb({
        text: 'DELETE FROM Meetup WHERE id=$1',
        values: [req.params.meetupId]
      });

      return res.status(200)
        .send({
          status: 200,
          data: [`Meetup with the id: ${meetupId} has been deleted successfully`]
        });
    } catch (e) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request. Please check and try again'
        });
    }
  },

  async getUpcomingMeetups(req, res) {
    try {
      const results = await db.queryDb({
        text: 'SELECT id, topic, location, happeningOn, tags FROM Meetup WHERE happeningOn >= NOW()'
      });

      const upComingMeetups = results.rows;

      if (upComingMeetups.length > 0) {
        const meetupRecords = upComingMeetups
          .map((meetup) => {
            meetup.title = meetup.topic;
            delete meetup.topic;
            return meetup;
          });

        return res.status(200).send({
          status: 200,
          data: meetupRecords
        });
      }

      return res.status(404).send({
        status: 404,
        error: 'There are no upcoming meetups'
      });
    } catch (e) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please check and try again'
        });
    }
  },

  async deleteMeetupQuestion(req, res) {
    return res.status(500).send({
      status: 500,
      error: 'Meetup question cannot be deleted at this time'
    });
  },

  updateMeetupQuestion(req, res) {
    const questionRecord = questions.find(
      question => String(question.createdBy) === req.body.userId
        && String(question.meetup) === req.params.meetupId
        && String(question.id) === req.params.questionId
    );

    const { title, body } = req.body;

    if (questionRecord) {
      questionRecord.title = title || questionRecord.title;

      questionRecord.body = body || questionRecord.body;

      const questionIdx = getIndex(questions, 'id', questionRecord.id);

      questions[questionIdx] = questionRecord;

      return res.status(200)
        .send({
          status: 200,
          data: [questionRecord]
        });
    }
    return res.status(404)
      .send({
        status: 404,
        error: 'The meetup you requested does not exist'
      });
  },

  getSingleMeetupQuestion(req, res) {
    const questionRecord = questions.find(
      question => String(question.meetup) === req.params.meetupId
        && String(question.id) === req.params.questionId
    );

    if (questionRecord) {
      return res.status(200)
        .send({
          status: 200,
          data: [questionRecord]
        });
    }
    return res.status(404)
      .send({
        status: 404,
        error: 'The requested question cannot be found'
      });
  },

  getAllRsvps(req, res) {
    const rsvpRecords = rsvps.filter(rsvp => String(rsvp.meetup) === req.params.meetupId);

    if (rsvpRecords.length) {
      return res.status(200)
        .send({
          status: 200,
          data: rsvpRecords
        });
    }
    return res.status(404)
      .send({
        status: 404,
        error: 'The requested meetup has no rsvps at the moment'
      });
  }
};
