import { Router } from 'express';
import questionController from '../controllers/question';
import schemaValidator from '../middlewares/schema/schemaValidator';

const router = Router();

const validateRequest = schemaValidator();

router.route('/questions')
  .get(questionController.getAllQuestions)
  .post(validateRequest, questionController.createQuestion);

router.patch('/questions/:questionId/upvote', questionController.upvoteQuestion);

router.patch('/questions/:questionId/downvote', questionController.downvoteQuestion);

router.post('/comments', questionController.addComments);

export default router;
