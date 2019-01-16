import db from '../db';

export default {
  async makeRsvp(req, res) {
    try {
      const meetupResults = await db.queryDb({
        text: `SELECT * FROM Meetup
               WHERE id=$1`,
        values: [req.params.meetupId]
      });

      const { response, userId } = req.body;

      const meetupRecord = meetupResults.rows[0];

      if (meetupRecord) {
        const rsvpResults = await db.queryDb({
          text: `INSERT INTO Rsvp ("user", meetup, response)
                 VALUES ($1, $2, $3) RETURNING *`,
          values: [userId, req.params.meetupId, response]
        });


        const { id, topic } = meetupRecord;

        const newRsvp = {
          meetup: id,
          topic,
          status: rsvpResults.rows[0].response
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
          error: 'The meetup you are requesting does not exist'
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
      const results = await db.queryDb({
        text: `SELECT * FROM Rsvp 
               WHERE id=$1 AND meetup=$2`,
        values: [rsvpId, meetupId]
      });

      const rsvpRecord = results.rows[0];
      if (rsvpRecord) {
        const updatedRsvp = await db.queryDb({
          text: `UPDATE Rsvp
                 SET response=$1
                 WHERE id=$2 RETURNING *`,
          values: [req.body.response || rsvpRecord.response, rsvpRecord.id]
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
          error: `The rsvp with the id: ${req.params.rsvpId} for meetup with the id: ${req.params.meetupId} does not exist`
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
