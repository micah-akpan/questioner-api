import { Router } from 'express';
import meetupController from '../controllers/meetup';

const router = Router();

router
  .route('/meetups')
  .post(meetupController.createNewMeetup)
  .get(meetupController.getAllMeetups);

router.route('/meetups/:meetup-id', meetupController.getSingleMeetup);


export default router;
