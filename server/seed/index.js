import Meetup from './meetups';
import Question from './questions';
import User from './users';
import Upvote from './upvote';
import Downvote from './downvote';
import Comment from './comments';
import Image from './images';
import Rsvp from './rsvps';

// The order of the tables
// in this object matters for now
// until a better alternative arrives
export default {
  Meetup,
  '"User"': User,
  Question,
  Comment,
  Upvote,
  Downvote,
  Image,
  Rsvp
};
