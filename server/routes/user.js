import { Router } from 'express';
import userController from '../controllers/user';

const router = Router();

router.post('/auth/signup', userController.signUpUser);

export default router;
