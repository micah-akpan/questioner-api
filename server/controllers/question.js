import db from '../db';
import {
  Question, Meetup, Upvote, Downvote, Comment
} from '../models/all';
import { sendResponse, sendServerErrorResponse } from './helpers';
import { arrayHasValues } from '../utils';

export default {
  async createQuestion(req, res) {
    try {
      const {
        title, body, meetupId
      } = req.body;

      const meetupExist = await Meetup.recordExist(meetupId);
      if (meetupExist) {
        const { userId } = req.decodedToken || req.body;
        const questionResult = await db.queryDb({
          text: `INSERT INTO Question (title, body, meetup, createdBy)
                 VALUES ($1, $2, $3, $4) RETURNING createdBy as user, meetup, title, body`,
          values: [title, body, meetupId, userId]
        });

        const newQuestion = questionResult.rows[0];
        return sendResponse({
          res,
          status: 201,
          payload: {
            status: 201,
            data: [newQuestion]
          }
        });
      }
      return sendResponse({
        res,
        status: 404,
        payload: {
          status: 404,
          error: `The meetup with id: ${meetupId} does not exist`
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async upvoteQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const { userId } = req.decodedToken || req.body;

      const questionExist = await Question.questionExist(questionId);

      if (questionExist) {
        const votes = await Question.getVotes(questionId);
        const voteExist = await Upvote.voteExist(userId, questionId);

        if (voteExist) {
          return sendResponse({
            res,
            status: 409,
            payload: {
              status: 409,
              error: 'You have already upvoted this question. You cannot upvote a question more than once'
            }
          });
        }

        await Upvote.create(userId, questionId);

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
      return sendServerErrorResponse(res);
    }
  },
  async downvoteQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const { userId } = req.decodedToken || req.body;

      const questionExist = await Question.questionExist(questionId);

      if (questionExist) {
        const votes = await Question.getVotes(questionId);
        const voteExist = await Downvote.voteExist(userId, questionId);

        if (voteExist) {
          return sendResponse({
            res,
            status: 409,
            payload: {
              status: 409,
              error: 'You have downvoted this question. You cannot downvote a question more than once'
            }
          });
        }

        await db.queryDb({
          text: `INSERT INTO Downvote ("user", question)
                 VALUES ($1, $2)`,
          values: [userId, questionId]
        });

        const question = await db.queryDb({
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
      return sendServerErrorResponse(res);
    }
  },

  async getAllQuestions(req, res) {
    try {
      const questions = await Question.sortQuestionByVotes();
      if (arrayHasValues(questions)) {
        return sendResponse({
          res,
          status: 200,
          payload: {
            status: 200,
            data: questions
          }
        });
      }
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async postComments(req, res) {
    try {
      const { questionId, comment } = req.body;
      const question = await Question.findById(questionId);

      if (question) {
        const newComment = {
          question: questionId,
          title: question.title,
          body: question.body,
          comment
        };

        await Comment.create({ comment, questionId });

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
      return sendServerErrorResponse(res);
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
            data: [`The question with id: ${questionId} has been deleted successfully`]
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
      return sendServerErrorResponse(res);
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
      return sendServerErrorResponse(res);
    }
  },
};
