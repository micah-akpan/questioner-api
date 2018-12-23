import { Router } from 'express';
import meetupController from '../controllers/meetup';

const router = Router();

router
  .route('/meetups')
  .post(meetupController.createNewMeetup)
  .get(meetupController.getAllMeetups);


export default router;
