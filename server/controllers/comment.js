import { Question, Comment } from '../models/all';
import { sendResponse, sendServerErrorResponse } from './helpers';
import { arrayHasValues } from '../utils';

export default {
  async createComment(req, res) {
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
          error: 'The requested question does not exist'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },

  async getAllComments(req, res) {
    try {
      const { questionId } = req.params;
      const questionExist = await Question.questionExist(questionId);
      if (questionExist) {
        const comments = await Comment.find({ where: { question: questionId } });
        if (arrayHasValues(comments)) {
          return sendResponse({
            res,
            status: 200,
            payload: {
              status: 200,
              data: comments
            }
          });
        }

        return sendResponse({
          res,
          status: 404,
          payload: {
            status: 404,
            error: 'The requested comment does not exist'
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
  }
};
