import { Router } from 'express';
import userController from '../controllers/user';
import userDataValidator from '../middlewares/schema/schemaValidator';

const validateRequest = userDataValidator();

const router = Router();

router.post('/auth/signup',
  validateRequest,
  userController.signUpUser);

router.post('/auth/login',
  validateRequest,
  userController.loginUser);

export default router;
