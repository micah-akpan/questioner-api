import { Router } from 'express';
// import multerUpload from '../middlewares/uploads/upload';
import meetupController from '../controllers/meetup';
import {
  Auth, Misc, schemaValidator
} from '../middlewares';
import multerUpload from '../middlewares/uploads';

const router = Router();

const { isAdmin, checkToken } = Auth;
const { checkParams } = Misc;

const validateRequest = schemaValidator();

router
  .route('/meetups')
  .post(
    checkToken,
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
  .put(checkParams, checkToken, isAdmin, meetupController.updateMeetup)
  .delete(checkParams, checkToken, isAdmin, meetupController.deleteMeetup);

router.route('/meetups/:meetupId/tags')
  .get(checkParams, meetupController.getAllMeetupTags)
  .post(
    checkParams,
    checkToken,
    validateRequest,
    isAdmin,
    meetupController.addTagsToMeetup
  );

router.route('/meetups/:meetupId/images')
  .get(checkParams, meetupController.getAllMeetupImages)
  .post(
    checkParams,
    checkToken,
    isAdmin,
    multerUpload.array('meetupPhotos', 5),
    meetupController.addImagesToMeetup
  );

router.route('/meetups/:meetupId/images/:imageId')
  .get(checkParams, meetupController.getSingleMeetupImage);

export default router;
