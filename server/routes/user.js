import { Router } from 'express';
import userController from '../controllers/user';
import userSchemaValidator from '../middlewares/schema/schemaValidator';
import Auth from '../middlewares/auth';

const validateRequest = userSchemaValidator();
const { isAdmin } = Auth;

const router = Router();

router.post('/auth/signup',
  validateRequest,
  userController.signUpUser);

router.post('/auth/login',
  validateRequest,
  userController.loginUser);

router.route('/users/')
  .get(isAdmin, validateRequest, userController.getAllUsers)
  .post(userController.updateUserProfile);

export default router;
