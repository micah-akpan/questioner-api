import express from 'express';
import meetupController from '../controllers/meetup';

const router = express.Router();

router.post('/meetups', meetupController.createNewMeetup);
router.get('/meetups', meetupController.getAllMeetups);

router.get('/meetups/:id', meetupController.getSingleMeetup);


export default router;
