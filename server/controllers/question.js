
const questions = [];

export default {
  createQuestion(req, res) {
    const { title, body } = req.body;
    if (!title || !body) {
      res.status(400)
        .send({
          status: 400,
          error: 'The title and body field is required'
        });
    } else {
      // Random primary key values
      const userId = 1;
      const meetupId = 1;

      questions.push({
        id: 1,
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
  }
};
