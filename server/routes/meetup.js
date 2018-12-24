import express from 'express';
import meetupController from '../controllers/meetup';

const router = express.Router();

router
  .route('/meetups')
  .post(meetupController.createNewMeetup)
  .get(meetupController.getAllMeetups);

router.get('/meetups/upcoming', meetupController.getUpcomingMeetups);

router
  .route('/meetups/:id')
  .get(meetupController.getSingleMeetup)
  .delete(meetupController.deleteMeetup);


router.post('/meetups/:id/rsvps', meetupController.rsvpMeetup);

export default router;
