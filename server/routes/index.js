import { Router } from 'express';
import meetupRouter from './meetup';
import questionRouter from './question';
import rsvpRouter from './rsvp';
import userRouter from './user';

const router = Router();

router.get('/', (req, res) => res.send({
  message: 'Welcome to the Questioner API'
}));

router.use('/api/v2', userRouter);
router.use('/api/v2', meetupRouter);
router.use('/api/v2', rsvpRouter);
router.use('/api/v2', questionRouter);

export default router;
