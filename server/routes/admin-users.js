/**
 * @module admin-users
 * @description Admin related API endpoint for users
 */

import { Router } from 'express';
import Auth from '../middlewares/auth';
import userController from '../controllers/user';
import userDataValidator from '../middlewares/schema/schemaValidator';

const router = Router();

const validateRequest = userDataValidator();
const { isAdmin } = Auth;

router.get('/users/',
  isAdmin,
  userController.getAllUsers);


router.route('/users/:userId')
  .get(isAdmin, validateRequest, userController.getUser)
  .patch(validateRequest, userController.updateUserProfile);

export default router;
