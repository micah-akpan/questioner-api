import { Router } from 'express';
import multerUpload from '../middlewares/uploads/upload';
import meetupController from '../controllers/meetup';
import {
  Auth, Misc, schemaValidator
} from '../middlewares';

const router = Router();

const { isAdmin } = Auth;
const { checkParams } = Misc;

const validateRequest = schemaValidator();

router
  .route('/meetups')
  .post(
    isAdmin,
    multerUpload.single('image'),
    validateRequest,
    meetupController.createNewMeetup
  )
  .get(meetupController.getAllMeetups);

router.get('/meetups/upcoming', meetupController.getUpcomingMeetups);

router
  .route('/meetups/:meetupId')
  .get(checkParams, meetupController.getSingleMeetup)
  .put(checkParams, isAdmin, meetupController.updateMeetup)
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
    multerUpload.array('meetupPhotos', 5),
    meetupController.addImagesToMeetup
  );

router.route('/meetups/:meetupId/images/:imageId')
  .get(checkParams, meetupController.getSingleMeetupImage);

export default router;
