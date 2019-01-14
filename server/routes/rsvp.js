import { Router } from 'express';
import rsvpController from '../controllers/rsvp';
import schemaValidator from '../middlewares/schema/schemaValidator';
import Auth from '../middlewares/auth';

const router = Router();
const validateResult = schemaValidator();

const { checkToken } = Auth;

router
  .route('/meetups/:meetupId/rsvps')
  .post(checkToken, validateResult, rsvpController.makeRsvp);

router
  .route('/meetups/:meetupId/rsvps/:rsvpId')
  .get(checkToken, rsvpController.getRsvp)
  .patch(checkToken, rsvpController.updateRsvp);

export default router;
