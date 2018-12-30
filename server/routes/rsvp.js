import { Router } from 'express';
import rsvpController from '../controllers/rsvp';
import schemaValidator from '../middlewares/schemaValidator';

const router = Router();
const validateResult = schemaValidator();

router.post('/meetups/:id/rsvps',
  validateResult, rsvpController.makeRsvp);

export default router;
