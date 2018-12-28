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
  .route('/meetups/:id')
  .get(meetupController.getSingleMeetup)
  .delete(meetupController.deleteMeetup);


export default router;
