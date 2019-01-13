import { omitProps, arrayHasValues } from '../utils';
import db from '../db';
import Question from '../models/Question';
import { sendResponse } from './helpers';

export default {
  async createQuestion(req, res) {
    try {
      const {
        title, body, meetupId, userId
      } = req.body;
      const questionResult = await db.queryDb({
        text: `INSERT INTO Question (title, body, meetup, createdBy)
               VALUES ($1, $2, $3, $4, $5) RETURNING createdBy as user, id, meetup, title, body`,
        values: [title, body, meetupId, userId]
      });

      const newQuestion = questionResult.rows[0];
      return sendResponse({
        res,
        status: 201,
        payload: {
          status: 201,
          data: [omitProps(newQuestion, ['id'])]
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
    }
  },

  async upvoteQuestion(req, res) {
    try {
      const { questionId } = req.params;

      const questionResult = await db.queryDb({
        text: 'SELECT id, createdBy as user, votes, meetup, title, body FROM Question WHERE id=$1',
        values: [questionId]
      });

      const question = questionResult.rows[0];


      if (question) {
        const { votes } = question;

        const voteResult = await db.queryDb({
          text: `SELECT * FROM Upvote 
                 WHERE "user"=$1 AND question=$2`,
          values: [req.body.userId, question.id]
        });

        if (arrayHasValues(voteResult.rows)) {
          return sendResponse({
            res,
            status: 422,
            payload: {
              status: 422,
              error: 'This user has already upvoted this question. You cannot upvote a question more than once'
            }
          });
        }

        await db.queryDb({
          text: `INSERT INTO Upvote ("user", question)
                 VALUES ($1, $2)`,
          values: [req.body.userId, question.id]
        });

        const questionResults = await db.queryDb({
          text: `UPDATE Question
                 SET votes = $1
                 WHERE id = $2 RETURNING meetup, title, body, votes`,
          values: [votes + 1, questionId]
        });

        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [questionResults.rows[0]]
          }
        });
      }
      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'The question cannot be upvoted because it does not exist'
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
    }
  },
  async downvoteQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const results = await db.queryDb({
        text: 'SELECT id, createdBy as user, meetup, title, body, votes FROM Question WHERE id=$1',
        values: [questionId]
      });

      let question = results.rows[0];


      if (question) {
        const { votes } = question;

        const voteResult = await db.queryDb({
          text: `SELECT * FROM Downvote 
                 WHERE "user"=$1 AND question=$2`,
          values: [req.body.userId, question.id]
        });

        if (arrayHasValues(voteResult.rows)) {
          return sendResponse({
            res,
            status: 422,
            payload: {
              status: 422,
              error: 'This user has already downvoted this question. You cannot downvote a question more than once'
            }
          });
        }

        await db.queryDb({
          text: `INSERT INTO Downvote ("user", question)
                 VALUES ($1, $2)`,
          values: [req.body.userId, question.id]
        });

        question = await db.queryDb({
          text: `UPDATE Question
                 SET votes = $1
                 WHERE id = $2 RETURNING meetup, title, body, votes`,
          values: [votes > 0 ? votes - 1 : 0, questionId]
        });

        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: [question.rows[0]]
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'The question cannot be downvoted because it does not exist'
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
    }
  },

  async getAllQuestions(req, res) {
    try {
      const results = await Question.findAll({ orderBy: 'votes', order: 'desc' });

      const questions = results.rows;

      if (questions.length > 0) {
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: questions
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
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
    }
  },

  async addComments(req, res) {
    try {
      const { questionId, commentText } = req.body;

      const results = await db.queryDb({
        text: 'SELECT * FROM Question WHERE id=$1',
        values: [questionId]
      });

      if (results.rows.length > 0) {
        const newComment = {
          question: questionId,
          title: results.rows[0].title,
          body: results.rows[0].body,
          comment: commentText
        };

        const addCommentsQuery = {
          text: `INSERT INTO Comment (body, question)
               VALUES ($1, $2) RETURNING *`,
          values: [commentText, questionId]
        };

        await db.queryDb(addCommentsQuery);
        return sendResponse({
          res,
          status: 201,
          payload: {
            status: 201,
            data: [newComment]
          }
        });
      }

      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: 'You cannot post comments on this question because the question does not exist'
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
    }
  },

  async getQuestions(req, res) {
    try {
      const result = await db.queryDb({
        text: `SELECT * FROM Question WHERE meetup=$1
               ORDER BY votes DESC`,
        values: [req.params.meetupId]
      });

      const meetupQuestions = result.rows;

      if (meetupQuestions.length) {
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
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
    }
  },

  async deleteMeetupQuestion(req, res) {
    const { questionId, meetupId } = req.params;

    try {
      const results = await db.queryDb({
        text: 'SELECT * FROM Question WHERE id=$1 AND meetup=$2 AND createdBy=$3',
        values: [questionId, meetupId, req.body.userId]
      });

      const question = results.rows[0];
      if (question) {
        await db.queryDb({
          text: 'DELETE FROM Question WHERE id=$1',
          values: [questionId]
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
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
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
          error: 'The meetup you requested does not exist'
        }
      });
    } catch (e) {
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request, please try again'
        }
      });
    }
  },

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
      return sendResponse({
        res,
        status: 400,
        payload: {
          status: 400,
          error: 'Invalid request. Please try again'
        }
      });
    }
  },
};
