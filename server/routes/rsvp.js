import { Router } from 'express';
import rsvpController from '../controllers/rsvp';
import schemaValidator from '../middlewares/schemaValidator';

const router = Router();
const validateResult = schemaValidator();

router.post('/meetups/:meetupId/rsvps',
  validateResult, rsvpController.makeRsvp);

router.patch('/meetups/:meetupId/rsvps/:rsvpId', rsvpController.updateRsvp);

export default router;
