import express from 'express';
import meetupController from '../controllers/meetup';

const router = express.Router();

router.get('/meetups/search', meetupController.searchMeetups);

router
  .route('/meetups')
  .post(meetupController.createNewMeetup)
  .get(meetupController.getAllMeetups);

router.get('/meetups/upcoming', meetupController.getUpcomingMeetups);

router
  .route('/meetups/:id')
  .get(meetupController.getSingleMeetup)
  .delete(meetupController.deleteMeetup);


export default router;
