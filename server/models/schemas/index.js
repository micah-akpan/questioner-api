/**
 * @module
 * @description Helper code specific to models
 */

import createMeetupSQLQuery from './meetup';
import createQuestionSQLQuery from './question';
import createUserSQLQuery from './user';
import createRsvpSQLQuery from './rsvp';
import createCommentSQLQuery from './comment';
import createUpvoteSQLQuery from './upvote';
import createDownvoteSQLQuery from './downvote';
import createImageSQLQuery from './image';

const createTableSQLQueries = {
  Meetup: createMeetupSQLQuery,
  Question: createQuestionSQLQuery,
  User: createUserSQLQuery,
  Rsvp: createRsvpSQLQuery,
  Comment: createCommentSQLQuery,
  Upvote: createUpvoteSQLQuery,
  Downvote: createDownvoteSQLQuery,
  Image: createImageSQLQuery
};

export default createTableSQLQueries;
