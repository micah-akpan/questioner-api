import { Router } from 'express';
import commentController from '../controllers/comment';
import { schemaValidator, Misc } from '../middlewares';

const validateRequest = schemaValidator();
const { checkParams } = Misc;

const router = Router();

router.post('/comments', validateRequest, commentController.createComment);
router.get('/questions/:questionId/comments', checkParams, commentController.getAllComments);

export default router;
