import _ from 'lodash';
import { omitProps, getIndex } from '../utils';
import { search } from './helpers/search';

export default {

  /* eslint-disable no-undef */
  getAllMeetups(req, res) {
    if (Object.keys(req.query).length) {
      const { searchTerm } = req.query;

      const byTopic = search(meetups, 'topic', searchTerm);
      const byLocation = search(meetups, 'location', searchTerm);
      const byTag = search(meetups, 'tags', searchTerm);

      const allMeetups = [...byTopic, ...byLocation, ...byTag];

      const filteredMeetups = _.uniqBy(allMeetups, 'id');

      if (allMeetups.length) {
        return res.status(200).send({
          status: 200,
          data: filteredMeetups
        });
      }
      return res.status(404).send({
        status: 404,
        error: `No meetups match with this search: ${req.query.searchTerm}`
      });
    }
    const meetupRecords = meetups
      .map(meetup => omitProps(meetup, ['images', 'createdOn']))
      .map((meetup) => {
        meetup.title = meetup.topic;
        delete meetup.topic;
        return meetup;
      });

    return res.status(200).send({
      status: 200,
      data: meetupRecords
    });
  },

  createNewMeetup(req, res) {
    const {
      location, images, topic, happeningOn, tags
    } = req.body;

    const lastMeetupId = meetups[meetups.length - 1].id;

    /* These validations aren't necessary
       as a schema validation middleware
       has been added only kept for reference
    */
    if (!topic || !location || !happeningOn) {
      return res.status(400)
        .send({
          status: 400,
          error: 'The topic, location and happeningOn fields are required fields'
        });
    }

    if (Number.isNaN(new Date(happeningOn).getTime())) {
      return res.status(422)
        .send({
          status: 422,
          error: 'You provided an invalid meetup date'
        });
    }

    if (new Date(happeningOn).getTime() < new Date().getTime()) {
      return res.status(422).send({
        status: 422,
        error: 'Meetup Date provided is in the past, provide a future date'
      });
    }

    const newMeetup = {
      topic,
      location,
      happeningOn,
      id: lastMeetupId + 1,
      createdOn: new Date(),
      images: images || [],
      tags: tags || []
    };

    meetups.push(newMeetup);

    const mRecord = omitProps(newMeetup, ['createdOn', 'images', 'id']);

    return res.status(201).send({
      status: 201,
      data: [mRecord]
    });
  },

  getSingleMeetup(req, res) {
    const meetupRecord = meetups.filter(
      meetup => String(meetup.id) === req.params.meetupId
    )[0];

    if (meetupRecord) {
      const mRecord = omitProps(meetupRecord, ['createdOn', 'images']);

      return res.status(200)
        .send({
          status: 200,
          data: [mRecord],
        });
    }
    return res.status(404)
      .send({
        status: 404,
        error: 'The requested meetup does not exist'
      });
  },

  deleteMeetup(req, res) {
    const meetupRecord = meetups.find(meetup => String(meetup.id) === req.params.meetupId);

    if (meetupRecord) {
      const meetupRecordIdx = getIndex(meetups, 'id', meetupRecord.id);

      meetups.splice(meetupRecordIdx, 1);

      return res.status(200)
        .send({
          status: 200,
          data: []
        });
    }
    return res.status(404)
      .send({
        status: 404,
        error: 'The requested meetup with the cannot be deleted because it does not exist'
      });
  },

  getUpcomingMeetups(req, res) {
    const upComingMeetups = meetups.filter(
      meetup => new Date(meetup.happeningOn).getTime() >= Date.now()
    );

    if (!upComingMeetups.length) {
      return res.status(404).send({
        status: 404,
        error: 'There are no upcoming meetups'
      });
    }
    const meetupRecords = upComingMeetups
      .map(meetup => omitProps(meetup, ['createdOn', 'images']))
      .map((meetup) => {
        meetup.title = meetup.topic;
        delete meetup.topic;
        return meetup;
      });

    return res.status(200).send({
      status: 200,
      data: meetupRecords
    });
  },

  getQuestions(req, res) {
    const meetupQuestions = questions.filter(
      question => String(question.meetup) === req.params.meetupId
    );

    if (meetupQuestions.length) {
      return res.status(200)
        .send({
          status: 200,
          data: meetupQuestions
        });
    }
    return res.status(404)
      .send({
        status: 404,
        error: 'There are no questions for this meetup'
      });
  },

  deleteMeetupQuestion(req, res) {
    const questionRecord = questions.find(
      question => String(question.createdBy) === req.body.userId
        && String(question.meetup) === req.params.meetupId
        && String(question.id) === req.params.questionId
    );

    if (questionRecord) {
      const questionIdx = getIndex(questions, 'id', questionRecord.id);
      questions.splice(questionIdx, 1);


      return res.status(200)
        .send({
          status: 200,
          data: []
        });
    }
    return res.status(404)
      .send({
        status: 404,
        error: 'The question cannot be deleted because it doesn\'t exist'
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
