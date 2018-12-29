import 'chai/register-should';
import sinon from 'sinon';
import questionController from '../../controllers/question';

describe('Question API', () => {
  describe('Create Question: POST /questions', () => {
    describe('handle valid data', () => {
      it('should create a question', () => {
        const req = {
          body: {
            title: 'Sample question',
            body: 'Sample question body',
            meetupId: 1,
            userId: 1
          }
        };
        const res = {};
        res.status = sinon.fake.returns(res);
        res.send = sinon.fake.returns(res);

        questionController.createQuestion(req, res);
        res.status.firstCall.args[0].should.equal(201);
        res.send.firstCall.args[0].should.have.property('data');
        res.send.firstCall.args[0].data[0].should.have.property('title');
      });
    });
  });

  describe('Upvote Question /questions/:id/upvote', () => {
    it('should upvote a question', () => {
      const req = {
        params: {
          id: '1'
        }
      };

      const res = {};
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      questionController.upvoteQuestion(req, res);
      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
    });

    it('should return an error for a non-existing question', () => {
      const req = {
        params: {
          id: '9999999'
        }
      };

      const res = {};
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      questionController.upvoteQuestion(req, res);
      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });

  describe('Downvote Question /questions/:id/downvote', () => {
    it('should downvote a question', () => {
      const req = {
        params: {
          id: '1'
        }
      };

      const res = {};
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      questionController.downvoteQuestion(req, res);
      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
    });

    it('should downvote a question', () => {
      const req = {
        params: {
          id: '1'
        }
      };

      const res = {};
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      questionController.downvoteQuestion(req, res);
      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
    });

    it('should return an error for a non-existing question', () => {
      const req = {
        params: {
          id: '9999999'
        }
      };

      const res = {};
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      questionController.downvoteQuestion(req, res);
      res.status.firstCall.args[0].should.equal(404);
      res.send.firstCall.args[0].should.have.property('error');
    });
  });

  describe('Fetch all questions /questions', () => {
    it('should return all questions', () => {
      const req = {};
      const res = {};
      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      questionController.getAllQuestions(req, res);
      res.status.firstCall.args[0].should.equal(200);
      res.send.firstCall.args[0].should.have.property('data');
      res.send.firstCall.args[0].data.should.be.an('array');
    });
  });
});
