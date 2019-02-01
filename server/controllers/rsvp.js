import db from '../db';
import { Meetup, Rsvp } from '../models/all';

export default {
  async makeRsvp(req, res) {
    try {
      const { meetupId } = req.params;
      const meetup = await Meetup.findById(meetupId);

      const { response } = req.body;
      const { userId } = req.decodedToken || req.body;

      if (meetup) {
        const rsvps = await Rsvp.find({ where: { '"user"': userId } });

        if (rsvps.length) {
          // user already rsvped for this meetup
          return res.status(409)
            .send({
              status: 409,
              error: 'You have already rsvped for this meetup'
            });
        }
        const rsvpQueryResult = await db.queryDb({
          text: `INSERT INTO Rsvp ("user", meetup, response)
                 VALUES ($1, $2, $3) RETURNING *`,
          values: [userId, meetupId, response]
        });

        const rsvp = rsvpQueryResult.rows[0];
        const { id, topic } = meetup;

        const newRsvp = {
          meetup: id,
          topic,
          status: rsvp.response
        };

        return res.status(201)
          .send({
            status: 201,
            data: [newRsvp]
          });
      }

      return res.status(404)
        .send({
          status: 404,
          error: 'The requested meetup does not exist'
        });
    } catch (e) {
      return res.status(500)
        .send({
          status: 500,
          error: 'Invalid request, please check request and try again'
        });
    }
  },

  async updateRsvp(req, res) {
    try {
      const { meetupId, rsvpId } = req.params;
      const { userId } = req.decodedToken || req.body;

      const results = await db.queryDb({
        text: `SELECT * FROM Rsvp 
                 WHERE id=$1 AND meetup=$2 AND "user"=$3`,
        values: [rsvpId, meetupId, userId]
      });

      const rsvpRecord = results.rows[0];

      if (rsvpRecord) {
        const updatedRsvp = await db.queryDb({
          text: `UPDATE Rsvp
                   SET response=$1
                   WHERE id=$2 RETURNING *`,
          values: [req.body.response, rsvpRecord.id]
        });
        return res.status(200)
          .send({
            status: 200,
            data: [updatedRsvp.rows[0]]
          });
      }

      return res.status(404)
        .send({
          status: 404,
          error: 'The requested rsvp does not exist for this user'
        });
    } catch (e) {
      return res.status(500)
        .send({
          status: 500,
          error: 'Invalid request, please check request and try again'
        });
    }
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
      return res.status(500)
        .send({
          status: 500,
          error: 'Invalid request, please check request and try again'
        });
    }
  },

  async getRsvp(req, res) {
    try {
      const { meetupId, rsvpId } = req.params;
      const results = await db.queryDb({
        text: `SELECT * FROM Rsvp
               WHERE id=$1 AND meetup=$2`,
        values: [rsvpId, meetupId]
      });

      const rsvpRecord = results.rows[0];

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
          error: `The rsvp with the id: ${req.params.rsvpId} for meetup with the id: ${req.params.meetupId} does not exist`
        });
    } catch (e) {
      return res.status(500)
        .send({
          status: 500,
          error: 'Invalid request, please check request and try again'
        });
    }
  }
};
