import { Router } from 'express';
import meetupRouter from './meetup';
import questionRouter from './question';
import rsvpRouter from './rsvp';
import userRouter from './user';

const router = Router();

router.get('/', (req, res) => res.send({
  message: 'Welcome to the Questioner API'
}));

router.use('/api/v1', userRouter);
router.use('/api/v1', meetupRouter);
router.use('/api/v1', rsvpRouter);
router.use('/api/v1', questionRouter);

export default router;
