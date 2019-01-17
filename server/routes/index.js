import { Router } from 'express';
import meetupRouter from './meetup';
import questionRouter from './question';
import rsvpRouter from './rsvp';
import userRouter from './user';
import Auth from '../middlewares/auth';
import Misc from '../middlewares/misc';

const { checkToken } = Auth;
const { trimBody } = Misc;

const router = Router();

router.get('/', (req, res) => res.send({
  message: 'Welcome to the Questioner API'
}));

router.use('/api/v1', trimBody, userRouter);
router.use('/api/v1', trimBody, checkToken, meetupRouter);
router.use('/api/v1', trimBody, checkToken, rsvpRouter);
router.use('/api/v1', trimBody, checkToken, questionRouter);

export default router;
