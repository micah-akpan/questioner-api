import express from 'express';
import meetupController from '../controllers/meetup';

const router = express.Router();

router
  .route('/meetups')
  .post(meetupController.createNewMeetup)
  .get(meetupController.getAllMeetups);

router
  .route('/meetups/:id')
  .get(meetupController.getSingleMeetup)
  .delete(meetupController.deleteMeetup);

export default router;
