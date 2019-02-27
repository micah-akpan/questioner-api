import db from '../db';
import { Meetup, Rsvp } from '../models/all';
import { sendResponse, sendServerErrorResponse } from './helpers';

export default {
  async getRsvps(req, res) {
    try {
      const rsvps = await Rsvp.find({ where: { meetup: req.params.meetupId } });
      if (rsvps.length > 0) {
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: rsvps
          }
        });
      }
      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'There are no RSVPs for this meetup at the moment'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async makeRsvp(req, res) {
    try {
      const { meetupId } = req.params;
      const meetup = await Meetup.findById(meetupId);

      const { response } = req.body;
      const { userId } = req.decodedToken;

      if (meetup) {
        const rsvps = await Rsvp.find({
          where: {
            '"user"': userId,
            meetup: meetupId
          }
        });

        if (rsvps.length) {
          return sendResponse({
            res,
            status: 409,
            payload: {
              status: 409,
              error: 'You have already rsvped for this meetup'
            }
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
        return sendResponse({
          res,
          status: 201,
          payload: {
            status: 201,
            data: [newRsvp]
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

  async updateRsvp(req, res) {
    try {
      const { meetupId, rsvpId } = req.params;
      const { userId } = req.decodedToken;

      const rsvps = await Rsvp.find({
        where: {
          id: rsvpId,
          meetup: meetupId,
          '"user"': userId
        }
      });

      const rsvp = rsvps[0];

      if (rsvp) {
        const updatedRsvpQueryResult = await db.queryDb({
          text: `UPDATE Rsvp
                   SET response=$1
                   WHERE id=$2 RETURNING *`,
          values: [req.body.response, rsvp.id]
        });

        const updatedRsvp = updatedRsvpQueryResult.rows[0];
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [updatedRsvp]
          }
        });
      }
      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'You have not rsvped for this meetup'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async getRsvp(req, res) {
    try {
      const { meetupId, rsvpId } = req.params;

      const rsvps = await Rsvp.find({
        where: {
          id: rsvpId,
          meetup: meetupId
        }
      });

      const rsvp = rsvps[0];

      if (rsvp) {
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [rsvp]
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'The rsvp for the requested meetup does not exist'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  }
};
