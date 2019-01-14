/**
 * @module
 * @description Helper code specific to models
 */

import createMeetupSQLQuery from './meetup';
import createQuestionSQLQuery from './question';
import createUserSQLQuery from './user';
import createRsvpSQLQuery from './rsvp';
import createCommentSQLQuery from './comment';

const createTableSQLQueries = {
  createMeetupSQLQuery,
  createQuestionSQLQuery,
  createUserSQLQuery,
  createRsvpSQLQuery,
  createCommentSQLQuery
};

export default createTableSQLQueries;
