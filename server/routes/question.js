import { Router } from 'express';
import questionController from '../controllers/question';
import schemaValidator from '../middlewares/schemaValidator';

const router = Router();

const validateRequest = schemaValidator();

router.post('/questions', validateRequest, questionController.createQuestion);

router.patch('/questions/:id/upvote', questionController.upvoteQuestion);

router.patch('/questions/:id/downvote', questionController.downvoteQuestion);

export default router;
