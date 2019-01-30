import { Router } from 'express';
import meetupRouter from './meetup';
import questionRouter from './question';
import rsvpRouter from './rsvp';
import userRouter from './user';
import userAdminRouter from './admin-users';
import Auth from '../middlewares/auth';
import Misc from '../middlewares/misc';

const { checkToken } = Auth;
const { trimBody } = Misc;

const router = Router();

router.get('/', (req, res) => res.send({
  message: 'Welcome to the Questioner API'
}));

router.get('/api/v1/docs', (req, res) => res.redirect(
  'https://questionerapi.docs.apiary.io'
));

router.use('/api/v1', trimBody, userRouter);
router.use('/api/v1', trimBody, checkToken, meetupRouter);
router.use('/api/v1', trimBody, checkToken, rsvpRouter);
router.use('/api/v1', trimBody, checkToken, questionRouter);
router.use('/api/v1', trimBody, checkToken, userAdminRouter);

export default router;
