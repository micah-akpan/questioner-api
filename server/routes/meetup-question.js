import { Router } from 'express';
import meetupQuestionController from '../controllers/meetup-question';
import { Auth, Misc } from '../middlewares';

const router = Router();

const { isAdmin } = Auth;
const { checkParams } = Misc;
const {
  getSingleMeetupQuestion,
  updateMeetupQuestion,
  deleteMeetupQuestion,
  getMeetupQuestions
} = meetupQuestionController;

router.get('/meetups/:meetupId/questions',
  checkParams,
  getMeetupQuestions);


router
  .route('/meetups/:meetupId/questions/:questionId')
  .get(checkParams, getSingleMeetupQuestion)
  .patch(checkParams, updateMeetupQuestion)
  .delete(checkParams, isAdmin, deleteMeetupQuestion);

export default router;
