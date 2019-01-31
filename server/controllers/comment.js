import { Question, Comment } from '../models/all';
import { sendResponse, sendServerErrorResponse } from './helpers';

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
          error: 'You cannot post comments on this question because the question does not exist'
        }
      });
    } catch (e) {
      return sendServerErrorResponse(res);
    }
  },
};
