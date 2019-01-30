import express from 'express';
import meetupController from '../controllers/meetup';
import questionController from '../controllers/question';
import schemaValidator from '../middlewares/schema/schemaValidator';
import Auth from '../middlewares/auth';
import Upload from '../middlewares/uploads';
import Misc from '../middlewares/misc';

const router = express.Router();

const { isAdmin } = Auth;
const { checkParams } = Misc;

const validateRequest = schemaValidator();

router
  .route('/meetups')
  .post(
    isAdmin,
    validateRequest,
    meetupController.createNewMeetup
  )
  .get(meetupController.getAllMeetups);

router.get('/meetups/upcoming', meetupController.getUpcomingMeetups);

router
  .route('/meetups/:meetupId')
  .get(checkParams, meetupController.getSingleMeetup)
  .delete(checkParams, isAdmin, meetupController.deleteMeetup);

router.get('/meetups/:meetupId/questions',
  checkParams,
  questionController.getQuestions);

router.route('/meetups/:meetupId/tags')
  .get(checkParams, meetupController.getAllMeetupTags)
  .post(
    checkParams,
    validateRequest,
    isAdmin,
    meetupController.addTagsToMeetup
  );

router.route('/meetups/:meetupId/images')
  .get(checkParams, meetupController.getAllMeetupImages)
  .post(
    checkParams,
    isAdmin,
    Upload.array('meetupPhotos', 4),
    meetupController.addImagesToMeetup
  );

router.route('/meetups/:meetupId/images/:imageId')
  .get(checkParams, meetupController.getSingleMeetupImage);

router
  .route('/meetups/:meetupId/questions/:questionId')
  .get(checkParams, questionController.getSingleMeetupQuestion)
  .patch(checkParams, questionController.updateMeetupQuestion)
  .delete(checkParams, isAdmin, questionController.deleteMeetupQuestion);

export default router;
