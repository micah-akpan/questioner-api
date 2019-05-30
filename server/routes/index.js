import { Router } from 'express';
import meetupRouter from './meetup';
import questionRouter from './question';
import rsvpRouter from './rsvp';
import userRouter from './user';
import userAdminRouter from './admin-users';
import commentRouter from './comment';
import meetupQuestionRouter from './meetup-question';
import { Auth, Misc } from '../middlewares';

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
router.use('/api/v1', trimBody, meetupRouter);
router.use('/api/v1', trimBody, checkToken, rsvpRouter);
router.use('/api/v1', trimBody, checkToken, questionRouter);
router.use('/api/v1', trimBody, checkToken, userAdminRouter);
router.use('/api/v1', trimBody, checkToken, commentRouter);
router.use('/api/v1', trimBody, checkToken, meetupQuestionRouter);

export default router;
