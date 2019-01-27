/**
 * @module admin-users
 * @description Admin related API endpoint for users
 */

import { Router } from 'express';
import Auth from '../middlewares/auth';
import Upload from '../middlewares/uploads';
import userController from '../controllers/user';
import userDataValidator from '../middlewares/schema/schemaValidator';
import Misc from '../middlewares/misc';

const router = Router();

const validateRequest = userDataValidator();
const { isAdmin } = Auth;
const { checkParams } = Misc;

router.get('/users',
  isAdmin,
  userController.getAllUsers);


router.route('/users/:userId')
  .get(checkParams, isAdmin, userController.getUser)
  .patch(
    checkParams,
    validateRequest,
    Upload.single('user-avatar'),
    userController.updateUserProfile
  );

export default router;
