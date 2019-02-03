import { Router } from 'express';
import meetupController from '../controllers/meetup';
import {
  Auth, Upload, Misc, schemaValidator
} from '../middlewares';

const router = Router();

const { isAdmin } = Auth;
const { checkParams } = Misc;

const validateRequest = schemaValidator();

router
  .route('/meetups')
  .post(
    isAdmin,
    validateRequest,
    Upload.single('image'),
    meetupController.createNewMeetup
  )
  .get(meetupController.getAllMeetups);

router.get('/meetups/upcoming', meetupController.getUpcomingMeetups);

router
  .route('/meetups/:meetupId')
  .get(checkParams, meetupController.getSingleMeetup)
  .delete(checkParams, isAdmin, meetupController.deleteMeetup);

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

export default router;
