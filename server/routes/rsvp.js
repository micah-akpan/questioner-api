import { Router } from 'express';
import rsvpController from '../controllers/rsvp';
import schemaValidator from '../middlewares/schema/schemaValidator';
import Misc from '../middlewares/misc';
import Auth from '../middlewares/auth';

const router = Router();
const validateResult = schemaValidator();

const { checkParams } = Misc;

router
  .route('/meetups/:meetupId/rsvps')
  .get(checkParams,
    Auth.isAdmin,
    rsvpController.getRsvps)
  .post(checkParams,
    validateResult,
    rsvpController.makeRsvp);

router
  .route('/meetups/:meetupId/rsvps/:rsvpId')
  .get(checkParams, rsvpController.getRsvp)
  .patch(checkParams, validateResult, rsvpController.updateRsvp);

export default router;
