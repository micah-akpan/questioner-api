import { Router } from 'express';
import questionController from '../controllers/question';
import schemaValidator from '../middlewares/schema/schemaValidator';
import Misc from '../middlewares/misc';

const router = Router();

const validateRequest = schemaValidator();
const { checkParams } = Misc;

router.route('/questions')
  .get(questionController.getAllQuestions)
  .post(validateRequest, questionController.createQuestion);

router.patch('/questions/:questionId/upvote',
  checkParams,
  questionController.upvoteQuestion);

router.patch('/questions/:questionId/downvote',
  checkParams,
  questionController.downvoteQuestion);

router.post('/comments',
  validateRequest,
  questionController.addComments);

export default router;
