import { omitProps } from '../utils';
import db from '../db';
import createTableQueries from '../models/helpers';

/* eslint-disable no-undef */
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

  upvoteQuestion(req, res) {
    let question = questions.filter(q => String(q.id) === req.params.id)[0];

    if (!question) {
      return res.status(404).send({
        status: 404,
        error: `The question with the id: ${req.params.id} does not exist`
      });
    }
    question.votes += 1;
    questions.forEach((q) => {
      if (q.id === question.id) {
        q = question;
      }
    });

    question = omitProps(question, ['id', 'createdOn', 'createdBy']);

    return res.status(200).send({
      status: 200,
      data: [
        question
      ]
    });
  },

  downvoteQuestion(req, res) {
    let question = questions.filter(q => String(q.id) === req.params.id)[0];

    if (!question) {
      return res.status(404)
        .send({
          status: 404,
          error: `The question with the id: ${req.params.id} does not exist`
        });
    }
    question.votes = question.votes > 0 ? question.votes - 1 : 0;

    question = omitProps(question, ['id', 'createdOn', 'createdBy']);

    return res.status(200)
      .send({
        status: 200,
        data: [question]
      });
  },

  getAllQuestions(req, res) {
    // for Admin ONLY
    return res.status(200)
      .send({
        status: 200,
        data: questions
      });
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
        text: 'SELECT * FROM Question WHERE meetup=$1',
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
