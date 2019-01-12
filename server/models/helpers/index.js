/**
 * @module
 * @description Helper code specific to models
 */

import createMeetupSQLQuery from './meetup';
import createQuestionSQLQuery from './question';
import createUserSQLQuery from './user';
import createRsvpSQLQuery from './rsvp';
import createCommentSQLQuery from './comment';
import createVoteSQLSQLQuery from './vote';

const createTableSQLQueries = {
  Meetup: createMeetupSQLQuery,
  Question: createQuestionSQLQuery,
  User: createUserSQLQuery,
  Rsvp: createRsvpSQLQuery,
  Comment: createCommentSQLQuery,
  Vote: createVoteSQLSQLQuery
};

export default createTableSQLQueries;
