import { omitProps, getIndex } from '../utils';
import db from '../db';

/* eslint-disable */
export default {
  async makeRsvp(req, res) {
    try {
      const results = await db.queryDb({
        text: `SELECT * FROM Meetup
               WHERE id=$1`,
        values: [req.params.meetupId]
      });

      const { response, userId } = req.body;

      const meetupRecord = results.rows[0];
      if (meetupRecord) {
        const rsvpResults = await db.queryDb({
          text: `INSERT INTO Rsvp ("user", meetup, response)
                 VALUES ($1, $2, $3) RETURNING *`,
          values: [userId, req.params.meetupId, response]
        });

        const newRsvp = omitProps(rsvpResults.rows[0], ['id', 'user']);

        return res.status(201)
          .send({
            status: 201,
            data: [newRsvp]
          });
      }

      return res.status(404)
        .send({
          status: 404,
          error: 'The meetup you are requesting does not exist'
        });
    } catch (e) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
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

      return res.status(200)
        .send({
          status: 200,
          data: [rsvpRecord]
        });
    }
    res.status(404)
      .send({
        status: 404,
        error: `The requested rsvp for meetup ${req.params.meetupId} does not exist`
      });
  },

  async getRsvps(req, res) {
    try {
      const results = await db.queryDb({
        text: 'SELECT * FROM Rsvp WHERE meetup=$1',
        values: [req.params.meetupId]
      });

      const rsvps = results.rows;

      if (rsvps.length > 0) {
        return res.status(200)
          .send({
            status: 200,
            data: rsvps
          });
      }

      return res.status(404)
        .send({
          status: 404,
          error: 'There are no RSVPs for this meetup at the moment'
        });
    } catch (e) {
      console.log(e)
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
        });
    }
  },

  getRsvp(req, res) {
    const rsvpRecord = rsvps.find(
      rsvp => String(rsvp.meetup) === req.params.meetupId
        && String(rsvp.id) === req.params.rsvpId
    );

    if (rsvpRecord) {
      return res.status(200)
        .send({
          status: 200,
          data: [rsvpRecord]
        });
    }
    return res.status(404)
      .send({
        status: 404,
        error: `The rsvp: ${req.params.rsvpId} for meetup:
${req.params.meetupId} does not exist`
      });
  },
};
