import { Router } from 'express';
import rsvpController from '../controllers/rsvp';
import schemaValidator from '../middlewares/schema/schemaValidator';
import Misc from '../middlewares/misc';

const router = Router();
const validateResult = schemaValidator();

const { allowOnly, checkParams } = Misc;

router
  .route('/meetups/:meetupId/rsvps')
  .post(validateResult,
    checkParams,
    allowOnly(['yes', 'no', 'maybe']), rsvpController.makeRsvp);

router
  .route('/meetups/:meetupId/rsvps/:rsvpId')
  .get(checkParams, rsvpController.getRsvp)
  .patch(checkParams, rsvpController.updateRsvp);

export default router;
