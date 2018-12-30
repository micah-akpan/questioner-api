import meetupRaw from '../data/meetup';
import rsvpRaw from '../data/rsvp';
import { omitProps } from '../utils';

const meetups = JSON.parse(meetupRaw);
export const rsvps = JSON.parse(rsvpRaw);

export default {
  makeRsvp(req, res) {
    const mRecord = meetups.find(meetup => String(meetup.id) === req.params.id);

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
  }
};
