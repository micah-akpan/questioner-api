import meetupSchema from './meetup';
import questionSchema from './question';
import rsvpSchema from './rsvp';
import userSchema from './user';

const loginUserSchema = userSchema.getUserDataSchema('login');
const signUpUserSchema = userSchema.getUserDataSchema('sign-up');

export default {
  '/meetups': meetupSchema,
  '/questions': questionSchema,
  '/meetups/:meetupId/rsvps': rsvpSchema,
  '/meetups/:meetupId/rsvps/:rsvpId': rsvpSchema,
  '/auth/signup': signUpUserSchema,
  '/auth/login': loginUserSchema
};
