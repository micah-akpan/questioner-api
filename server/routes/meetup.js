import express from 'express';
import meetupController from '../controllers/meetup';
import questionController from '../controllers/question';
import rsvpController from '../controllers/rsvp';
import schemaValidator from '../middlewares/schema/schemaValidator';
import Auth from '../middlewares/auth';
import Upload from '../middlewares/uploads';

const router = express.Router();

const { checkToken, isAdmin } = Auth;

const validateRequest = schemaValidator(true);

router
  .route('/meetups')
  .post(
    validateRequest,
    checkToken,
    isAdmin,
    meetupController.createNewMeetup
  )
  .get(checkToken, meetupController.getAllMeetups);

router.get('/meetups/upcoming',
  checkToken,
  meetupController.getUpcomingMeetups);

router
  .route('/meetups/:meetupId')
  .get(checkToken, meetupController.getSingleMeetup)
  .delete(checkToken,
    isAdmin,
    meetupController.deleteMeetup);

router.get('/meetups/:meetupId/questions', checkToken,
  questionController.getQuestions);

router.get('/meetups/:meetupId/rsvps', checkToken, isAdmin, rsvpController.getRsvps);

router.post('/meetups/:meetupId/tags', checkToken, isAdmin, meetupController.addTagsToMeetup);
router.post('/meetups/:meetupId/images',
  checkToken,
  isAdmin,
  Upload.array('meetupPhotos', 4),
  meetupController.addImagesToMeetup);

router
  .route('/meetups/:meetupId/questions/:questionId')
  .get(checkToken, questionController.getSingleMeetupQuestion)
  .patch(checkToken, questionController.updateMeetupQuestion)
  .delete(checkToken, isAdmin, questionController.deleteMeetupQuestion);

export default router;
