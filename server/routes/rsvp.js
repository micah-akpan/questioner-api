import { Router } from 'express';
import rsvpController from '../controllers/rsvp';

const router = Router();

router.post('/meetups/:id/rsvps', rsvpController.makeRsvp);

export default router;
