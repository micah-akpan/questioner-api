import { Router } from 'express';
import commentController from '../controllers/comment';
import schemaValidator from '../middlewares/schema/schemaValidator';

const validateRequest = schemaValidator();

const router = Router();

router.post('/comments', validateRequest, commentController.createComment);

export default router;
