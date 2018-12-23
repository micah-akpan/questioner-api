import express from 'express';
import meetupController from '../controllers/meetup';

const router = express.Router();

router
  .route('/meetups')
  .post(meetupController.createNewMeetup)
  .get(meetupController.getAllMeetups);

router.get('/meetups/:meetup-id', meetupController.getSingleMeetup);


export default router;
