import { Router } from 'express';
import questionController from '../controllers/question';
import schemaValidator from '../middlewares/schema/schemaValidator';
import Auth from '../middlewares/auth';

const router = Router();

const validateRequest = schemaValidator();

const { checkToken } = Auth;

router.route('/questions')
  .get(checkToken, questionController.getAllQuestions)
  .post(checkToken, validateRequest, questionController.createQuestion);

router.patch('/questions/:questionId/upvote', checkToken, questionController.upvoteQuestion);

router.patch('/questions/:questionId/downvote', checkToken, questionController.downvoteQuestion);

router.post('/comments', checkToken, questionController.addComments);

export default router;
