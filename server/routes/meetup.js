import express from 'express';
import meetupController from '../controllers/meetup';
import questionController from '../controllers/question';
import rsvpController from '../controllers/rsvp';
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

router.get('/meetups/:meetupId/rsvps', rsvpController.getRsvps);

router
  .route('/meetups/:meetupId/questions/:questionId')
  .get(questionController.getSingleMeetupQuestion)
  .patch(questionController.updateMeetupQuestion)
  .delete(questionController.deleteMeetupQuestion);

export default router;
