import meetupRaw from '../data/meetup';
import rsvpRaw from '../data/rsvp';
import { omitProps, getIndex } from '../utils';

const meetups = JSON.parse(meetupRaw);
export const rsvps = JSON.parse(rsvpRaw);

export default {
  makeRsvp(req, res) {
    const mRecord = meetups.find(meetup => String(meetup.id) === req.params.meetupId);

    if (!mRecord) {
      res.status(404)
        .send({
          status: 404,
          error: 'The meetup you are requesting does not exist'
        });
    } else {
      const { response, userId } = req.body;

      const lastRsvpId = rsvps[rsvps.length - 1].id;

      const newRsvp = {
        id: lastRsvpId + 1,
        meetup: mRecord.id,
        user: userId,
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
  },

  updateRsvp(req, res) {
    const rsvpRecord = rsvps.find(rsvp => String(rsvp.meetup) === req.params.meetupId
      && String(rsvp.id) === req.params.rsvpId);

    if (rsvpRecord) {
      rsvpRecord.response = req.body.response || rsvpRecord.response;

      const rsvpRecordIdx = getIndex(rsvps, 'id', rsvpRecord.id);

      rsvps[rsvpRecordIdx] = rsvpRecord;

      res.status(200)
        .send({
          status: 200,
          data: [rsvpRecord]
        });
    } else {
      res.status(404)
        .send({
          status: 404,
          error: `The requested rsvp for meetup ${req.params.meetupId} does not exist`
        });
    }
  },

  getRsvps(req, res) {
    return res.status(200).send({
      status: 200,
      data: rsvps
    });
  },

  getRsvp(req, res) {
    const rsvpRecord = rsvps.find(
      rsvp => String(rsvp.meetup) === req.params.meetupId
        && String(rsvp.id) === req.params.rsvpId
    );

    if (rsvpRecord) {
      res.status(200)
        .send({
          status: 200,
          data: [rsvpRecord]
        });
    } else {
      res.status(404)
        .send({
          status: 404,
          error: `The rsvp: ${req.params.rsvpId} for meetup: ${req.params.meetupId} does not exist`
        });
    }
  }
};
