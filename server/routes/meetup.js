import express from 'express';
import meetupController from '../controllers/meetup';
import schemaValidator from '../middlewares/schemaValidator';

const router = express.Router();

const validateRequest = schemaValidator(true);

router.get('/meetups/search', meetupController.searchMeetups);

router
  .route('/meetups')
  .post(validateRequest, meetupController.createNewMeetup)
  .get(meetupController.getAllMeetups);

router.get('/meetups/upcoming', meetupController.getUpcomingMeetups);

router
  .route('/meetups/:meetupId')
  .get(meetupController.getSingleMeetup)
  .delete(meetupController.deleteMeetup);

router.get('/meetups/:meetupId/questions', meetupController.getQuestions);

router.get('/meetups/:meetupId/rsvps', meetupController.getAllRsvps);

router
  .route('/meetups/:meetupId/questions/:questionId')
  .patch(meetupController.updateMeetupQuestion)
  .delete(meetupController.deleteMeetupQuestion);

export default router;
