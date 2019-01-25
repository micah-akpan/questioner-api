import meetupSchema from './meetup';
import questionSchema from './question';
import rsvpSchema from './rsvp';
import userSchema from './user';
import tagSchema from './tag';
import commentSchema from './comment';

const { getUserDataSchema } = userSchema;

const loginUserSchema = getUserDataSchema('login');
const signUpUserSchema = getUserDataSchema('sign-up');
const userProfileSchema = getUserDataSchema('user-profile');

export default {
  '/meetups': meetupSchema,
  '/questions': questionSchema,
  '/meetups/:meetupId/rsvps': rsvpSchema,
  '/meetups/:meetupId/rsvps/:rsvpId': rsvpSchema,
  '/auth/signup': signUpUserSchema,
  '/auth/login': loginUserSchema,
  '/users/:userId': userProfileSchema,
  '/meetups/:meetupId/tags': tagSchema,
  '/comments': commentSchema
};
