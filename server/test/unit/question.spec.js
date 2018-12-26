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
            body: 'Sample question body'
          }
        };
        const res = {
          status() { },
          send() { }
        };

        res.status = sinon.stub(res, 'status').returns(res);
        res.send = sinon.stub(res, 'send').returns(res);

        questionController.createQuestion(req, res);
        res.status.firstCall.args[0].should.equal(201);
        res.send.firstCall.args[0].should.have.property('data');
        res.send.firstCall.args[0].data[0].should.have.property('title');
      });
    });
  });

  describe('handle invalid data', () => {
    it('should not create a question if required fields are missing', () => {
      const req = {
        body: {
          body: 'question body'
        }
      };

      const res = {
        // status() {},
        // send() {}
      };


      res.status = sinon.fake.returns(res);
      res.send = sinon.fake.returns(res);

      questionController.createQuestion(req, res);
      res.status.firstCall.args[0].should.equal(400);
    });
  });
});
