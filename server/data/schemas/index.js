import meetupSchemaValidator from './meetup';
import questionSchemaValidator from './question';

export default {
  '/meetups': meetupSchemaValidator,
  '/questions': questionSchemaValidator
};
