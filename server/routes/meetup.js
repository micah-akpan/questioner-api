import express from 'express';
import meetupController from '../controllers/meetup';
import questionController from '../controllers/question';
import schemaValidator from '../middlewares/schemaValidator';

const router = express.Router();

const validateRequest = schemaValidator(true);

router
  .route('/meetups')
  .post(validateRequest, meetupController.createNewMeetup)
  .get(meetupController.getAllMeetups);

router.get('/meetups/upcoming', meetupController.getUpcomingMeetups);

router
  .route('/meetups/:meetupId')
  .get(meetupController.getSingleMeetup)
  .delete(meetupController.deleteMeetup);

router.get('/meetups/:meetupId/questions', questionController.getQuestions);

router.get('/meetups/:meetupId/rsvps', meetupController.getAllRsvps);

router
  .route('/meetups/:meetupId/questions/:questionId')
  .get(meetupController.getSingleMeetupQuestion)
  .patch(meetupController.updateMeetupQuestion)
  .delete(meetupController.deleteMeetupQuestion);

export default router;
