import meetupSchemaValidator from './meetup';
import questionSchemaValidator from './question';
import rsvpSchemaValidator from './rsvp';

export default {
  '/meetups': meetupSchemaValidator,
  '/questions': questionSchemaValidator,
  '/meetups/:id/rsvps': rsvpSchemaValidator
};
