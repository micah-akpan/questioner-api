import questionRaw from '../data/question';
import { omitProps } from '../utils';

const questions = JSON.parse(questionRaw);

export default {
  createQuestion(req, res) {
    const {
      title, body, meetupId, userId
    } = req.body;
    if (!title || !body || !meetupId || !userId) {
      res.status(400)
        .send({
          status: 400,
          error: 'The title, body, meetupId and userId fields are required fields'
        });
    } else {
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
    }
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
  }
};
