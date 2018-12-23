import { Router } from 'express';
import questionController from '../controllers/question';

const router = Router();

router.post('/questions', questionController.createQuestion);

export default router;
