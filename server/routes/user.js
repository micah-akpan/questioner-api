import { Router } from 'express';
import userController from '../controllers/user';
import userSchemaValidator from '../middlewares/schema/schemaValidator';

const validateRequest = userSchemaValidator();

const router = Router();

router.post('/auth/signup', validateRequest, userController.signUpUser);

router.post('/auth/login', userController.loginUser);

export default router;
