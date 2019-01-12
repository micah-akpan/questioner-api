import meetupSchemaValidator from './meetup';
import questionSchemaValidator from './question';
import rsvpSchemaValidator from './rsvp';

export default {
  '/meetups': meetupSchemaValidator,
  '/questions': questionSchemaValidator,
  '/meetups/:meetupId/rsvps': rsvpSchemaValidator,
  '/meetups/:meetupId/rsvps/:rsvpId': rsvpSchemaValidator
};
