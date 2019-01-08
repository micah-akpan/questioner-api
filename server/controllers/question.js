import { omitProps } from '../utils';
import db from '../db';
import createTableQueries from '../models/helpers';

/* eslint-disable no-undef */
export default {
  createQuestion(req, res) {
    const {
      title, body, meetupId, userId
    } = req.body;

    const lastId = questions[questions.length - 1].id;

    questions.push({
      id: lastId + 1,
      createdOn: new Date(),
      createdBy: userId,
      meetup: meetupId,
      title,
      body,
      votes: 0
    });

    res.status(201)
      .send({
        status: 201,
        data: [{
          user: userId,
          meetup: meetupId,
          title,
          body
        }]
      });
  },

  upvoteQuestion(req, res) {
    let question = questions.filter(q => String(q.id) === req.params.id)[0];

    if (!question) {
      res.status(404).send({
        status: 404,
        error: `The question with the id: ${req.params.id} does not exist`
      });
    } else {
      question.votes += 1;
      questions.forEach((q) => {
        if (q.id === question.id) {
          q = question;
        }
      });

      question = omitProps(question, ['id', 'createdOn', 'createdBy']);

      res.status(200).send({
        status: 200,
        data: [
          question
        ]
      });
    }
  },

  downvoteQuestion(req, res) {
    let question = questions.filter(q => String(q.id) === req.params.id)[0];

    if (!question) {
      res.status(404)
        .send({
          status: 404,
          error: `The question with the id: ${req.params.id} does not exist`
        });
    } else {
      question.votes = question.votes > 0 ? question.votes - 1 : 0;

      question = omitProps(question, ['id', 'createdOn', 'createdBy']);

      res.status(200)
        .send({
          status: 200,
          data: [question]
        });
    }
  },

  getAllQuestions(req, res) {
    // for Admin ONLY
    return res.status(200).send({
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
    } catch (e) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Invalid request, please check and try again'
        });
    }
  }
};
