import db from '../db';
import {
  Question, Meetup, Upvote, Downvote
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
        const { userId } = req.decodedToken;
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
      const { userId } = req.decodedToken;

      const questionByUser = await Question.find({
        where: {
          createdBy: userId
        }
      });

      if (questionByUser.createdby === userId) {
        return sendResponse({
          res,
          status: 422,
          payload: {
            status: 422,
            error: 'You cannot upvote your own question'
          }
        });
      }

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
              error: 'You have already upvoted this question'
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

        const userHasDownvoted = await Downvote.find({
          where: {
            '"user"': userId
          }
        });

        if (arrayHasValues(userHasDownvoted)) {
          // User has downvoted this question
          // Enable user to downvote this question if user upvoted earlier
          await db.queryDb({
            text: 'DELETE FROM Downvote WHERE "user"=$1',
            values: [userId]
          });
        }

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
      const { userId } = req.decodedToken;

      const questionByUser = await Question.find({
        where: {
          createdBy: userId
        }
      });

      if (questionByUser.createdby === userId) {
        return sendResponse({
          res,
          status: 422,
          payload: {
            status: 422,
            error: 'You cannot downvote your own question'
          }
        });
      }

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
              error: 'You have already downvoted this question'
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

        const userHasUpvoted = await Upvote.find({
          where: {
            '"user"': userId
          }
        });

        if (arrayHasValues(userHasUpvoted)) {
          // User has upvoted this question
          // Enable user to upvote this question if user downvoted earlier
          await db.queryDb({
            text: 'DELETE FROM Upvote WHERE "user"=$1',
            values: [userId]
          });
        }

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
      const questions = await Question.findAndSortByVotes();
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
  }
};
