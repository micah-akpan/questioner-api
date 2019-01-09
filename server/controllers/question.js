import { omitProps } from '../utils';
import db from '../db';
import createTableQueries from '../models/helpers';


export default {
  async createQuestion(req, res) {
    const {
      title, body, meetupId, userId
    } = req.body;

    try {
      await db.queryDb({
        text: `INSERT INTO Question (title, body, meetup, createdBy)
               VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [title, body, meetupId, userId]
      });

      return res.status(201)
        .send({
          status: 201,
          data: [{
            user: userId,
            meetup: meetupId,
            title,
            body
          }]
        });
    } catch (e) {
      res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
        });
    }
  },

  async upvoteQuestion(req, res) {
    try {
      const results = await db.queryDb({
        text: 'SELECT * FROM Question WHERE id=$1',
        values: [req.params.questionId]
      });

      let question = results.rows[0];


      if (question) {
        const { votes } = question;

        await db.queryDb({
          text: `UPDATE Question
                 SET votes = $1
                 WHERE id = $2`,
          values: [votes + 1, req.params.questionId]
        });

        question = omitProps(question, ['id', 'createdOn', 'createdBy']);

        return res.status(200).send({
          status: 200,
          data: [
            question
          ]
        });
      }
      return res.status(404)
        .send({
          status: 404,
          error: 'The question cannot be upvoted because it does not exist'
        });
    } catch (e) {
      res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
        });
    }
  },

  async downvoteQuestion(req, res) {
    try {
      const results = await db.queryDb({
        text: 'SELECT * FROM Question WHERE id=$1',
        values: [req.params.questionId]
      });

      let question = results.rows[0];


      if (question) {
        const { votes } = question;

        await db.queryDb({
          text: `UPDATE Question
                 SET votes = $1
                 WHERE id = $2`,
          values: [votes > 0 ? votes - 1 : 0, req.params.questionId]
        });

        question = omitProps(question, ['id', 'createdOn', 'createdBy']);

        return res.status(200).send({
          status: 200,
          data: [
            question
          ]
        });
      }

      return res.status(404)
        .send({
          status: 404,
          error: 'The question cannot be downvoted because it does not exist'
        });
    } catch (e) {
      res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
        });
    }
  },

  async getAllQuestions(req, res) {
    try {
      const results = await db.queryDb({
        text: 'SELECT * FROM Question ORDER BY votes DESC'
      });

      const questions = results.rows;

      if (questions.length > 0) {
        return res.status(200)
          .send({
            status: 200,
            data: questions
          });
      }
      return res.status(404)
        .send({
          status: 404,
          error: 'There are no questions at the moment'
        });
    } catch (e) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
        });
    }
  },

  async addComments(req, res) {
    try {
      const { questionId, commentText } = req.body;

      await db.queryDb(createTableQueries.createCommentSQLQuery);

      const addCommentsQuery = {
        text: `INSERT INTO Comment (body, question)
             VALUES ($1, $2) RETURNING *`,
        values: [commentText, questionId]
      };

      const results = await db.queryDb({
        text: 'SELECT * FROM Question WHERE id=$1',
        values: [questionId]
      });

      if (results.rows.length > 0) {
        const payload = {
          question: questionId,
          title: results.rows[0].title,
          body: results.rows[0].body,
          comment: commentText
        };

        await db.queryDb(addCommentsQuery);

        return res.status(201)
          .send({
            status: 201,
            data: [payload]
          });
      }
      return res.status(404)
        .send({
          status: 404,
          error: 'You cannot comment on this question because the question does not exist'
        });
    } catch (e) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please check and try again'
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
        return res.status(200)
          .send({
            status: 200,
            data: meetupQuestions
          });
      }

      return res.status(404)
        .send({
          status: 404,
          error: 'There are no questions for this meetup at the moment'
        });
    } catch (e) {
      res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please try again'
        });
    }
  },
};
