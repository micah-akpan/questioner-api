import { Router } from 'express';
import questionController from '../controllers/question';

const router = Router();

router.post('/questions', questionController.createQuestion);

router.patch('/questions/:id/upvote', questionController.upvoteQuestion);

router.patch('/questions/:id/downvote', questionController.downvoteQuestion);

export default router;
