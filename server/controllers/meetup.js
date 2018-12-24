import Meetup from '../models/meetup/meetup';
import { omitProps } from '../utils';

export const rsvps = [{
  id: 1,
  meetup: 1,
  user: 1,
  response: 'Yes'
}];

export default {

  getAllMeetups(req, res) {
    const meetups = Meetup.findAll();
    return res.status(200).send({
      status: 200,
      data: meetups.slice()
    });
  },

  createNewMeetup(req, res) {
    const {
      location, topic, happeningOn,
    } = req.body;

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

    const newMeetup = Meetup.create({
      topic,
      location,
      happeningOn
    });

    const mRecord = omitProps(newMeetup, ['createdOn', 'images', 'id']);

    return res.status(201).send({
      status: 201,
      data: [mRecord]
    });
  },

  getSingleMeetup(req, res) {
    const meetupRecord = Meetup.meetups.filter(
      meetup => String(meetup.id) === req.params.id
    )[0];

    let mRecord;

    if (meetupRecord) {
      mRecord = omitProps(meetupRecord, ['createdOn', 'images']);
    } else {
      return res.status(404)
        .send({
          status: 404,
          error: 'The requested meetup does not exist'
        });
    }
    return res.status(200)
      .send({
        status: 200,
        data: [mRecord],
      });
  },

  /* eslint-disable */
  deleteMeetup(req, res) {
    const mRecords = meetups.filter(meetup => String(meetup.id) === req.params.id);

    if (mRecords.length === 0) {
      return res.status(404).send({
        status: 404,
        error: 'The requested meetup with the cannot be deleted because it does not exist'
      });
    }

    const newMeetupRecords = meetups.filter(meetup => String(meetup.id) !== req.params.id);
    meetups = newMeetupRecords;

    return res.status(200)
      .send({
        status: 200,
        data: []
      });
  },

  getUpcomingMeetups(req, res) {
    const now = new Date().getTime();

    const upComingMeetups = meetups.filter(
      meetup => new Date(meetup.happeningOn).getTime() >= now
    );

    if (!upComingMeetups.length) {
      res.status(404).send({
        status: 404,
        error: 'There are no upcoming meetups'
      });
    } else {
      const mRecords = upComingMeetups.map(
        meetup => omitProps(meetup, ['createdOn', 'images'])
      );

      res.status(200).send({
        status: 200,
        data: mRecords
      });
    }
  },

  rsvpMeetup(req, res) {
    const mRecord = meetups.find(meetup => String(meetup.id) === req.params.id);

    if (!mRecord) {
      res.status(404)
        .send({
          status: 404,
          error: 'The meetup you are requesting does not exist'
        });
    } else {
      const { response } = req.body;

      const lastRsvpId = rsvps[rsvps.length - 1].id;

      const newRsvp = {
        id: lastRsvpId + 1,
        meetup: mRecord.id,
        user: 1, // dynamically generated
        status: response
      };

      rsvps.push(newRsvp);

      const rsvpRecord = omitProps(newRsvp, ['id', 'user']);

      rsvpRecord.topic = mRecord.topic;

      res.status(201)
        .send({
          status: 201,
          data: [rsvpRecord]
        });
    }
  }
};
