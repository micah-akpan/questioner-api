import express from 'express';
import meetupController from '../controllers/meetup';
import questionController from '../controllers/question';
import rsvpController from '../controllers/rsvp';
import schemaValidator from '../middlewares/schema/schemaValidator';
import Auth from '../middlewares/auth';
import Upload from '../middlewares/uploads';

const router = express.Router();

const { isAdmin } = Auth;

const validateRequest = schemaValidator(true);

router
  .route('/meetups')
  .post(
    validateRequest,
    isAdmin,
    meetupController.createNewMeetup
  )
  .get(meetupController.getAllMeetups);

router.get('/meetups/upcoming', meetupController.getUpcomingMeetups);

router
  .route('/meetups/:meetupId')
  .get(meetupController.getSingleMeetup)
  .delete(isAdmin, meetupController.deleteMeetup);

router.get('/meetups/:meetupId/questions', questionController.getQuestions);

router.get('/meetups/:meetupId/rsvps', isAdmin, rsvpController.getRsvps);

router.post('/meetups/:meetupId/tags', isAdmin, meetupController.addTagsToMeetup);
router.post('/meetups/:meetupId/images',
  isAdmin,
  Upload.array('meetupPhotos', 4),
  meetupController.addImagesToMeetup);

router
  .route('/meetups/:meetupId/questions/:questionId')
  .get(questionController.getSingleMeetupQuestion)
  .patch(questionController.updateMeetupQuestion)
  .delete(isAdmin, questionController.deleteMeetupQuestion);

export default router;
