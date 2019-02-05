import db from '../db';
import { sendResponse, sendServerErrorResponse } from './helpers';
import { arrayHasValues } from '../utils';

export default {
  async getSingleMeetupQuestion(req, res) {
    const { questionId, meetupId } = req.params;

    try {
      const results = await db.queryDb({
        text: `SELECT * FROM Question
               WHERE id=$1 AND meetup=$2`,
        values: [questionId, meetupId]
      });

      const questionRecord = results.rows[0];

      if (questionRecord) {
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [questionRecord]
          }
        });
      }
      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'The requested question does not exist'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async updateMeetupQuestion(req, res) {
    try {
      const { meetupId, questionId } = req.params;
      const { title, body } = req.body;
      const results = await db.queryDb({
        text: `SELECT * FROM Question
               WHERE id=$1 AND createdBy=$2 AND meetup=$3`,
        values: [questionId, req.body.userId, meetupId]
      });

      const questionRecord = results.rows[0];

      if (questionRecord) {
        const questionResults = await db.queryDb({
          text: `UPDATE Question
                 SET title=$1, body=$2, createdby=$4
                 WHERE id=$3 RETURNING *`,
          values: [title || questionRecord.title,
            body || questionRecord.body, questionRecord.id, questionRecord.createdby
          ]
        });

        const updatedQuestion = questionResults.rows[0];

        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [updatedQuestion]
          }
        });
      }
      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'The requested question does not exist'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async deleteMeetupQuestion(req, res) {
    const { questionId, meetupId } = req.params;
    const { userId } = req.decodedToken;

    try {
      const results = await db.queryDb({
        text: 'SELECT * FROM Question WHERE id=$1 AND meetup=$2 AND createdBy=$3',
        values: [questionId, meetupId, userId]
      });

      const question = results.rows[0];
      if (question) {
        await db.queryDb({
          text: 'DELETE FROM Question WHERE id=$1',
          values: [questionId]
        });

        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [`Question with id: ${questionId} has been deleted successfully`]
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'The requested question cannot be deleted because it doesn\'t exist'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async getMeetupQuestions(req, res) {
    try {
      const result = await db.queryDb({
        text: `SELECT * FROM Question WHERE meetup=$1
               ORDER BY votes DESC`,
        values: [req.params.meetupId]
      });

      const meetupQuestions = result.rows;

      if (arrayHasValues(meetupQuestions)) {
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: meetupQuestions
          }
        });
      }
      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'There are no questions for this meetup at the moment'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  }
};
