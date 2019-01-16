import meetupSchema from './meetup';
import questionSchema from './question';
import rsvpSchema from './rsvp';
import userSchema from './user';

export default {
  '/meetups': meetupSchema,
  '/questions': questionSchema,
  '/meetups/:meetupId/rsvps': rsvpSchema,
  '/meetups/:meetupId/rsvps/:rsvpId': rsvpSchema,
  '/auth/signup': userSchema
};
