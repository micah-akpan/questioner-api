/**
 * @module
 * @description Helper code specific to models
 */

import createMeetupSQLQuery from './meetup';
import createQuestionSQLQuery from './question';
import createUserSQLQuery from './user';
import createRsvpSQLQuery from './rsvp';

const createTableSQLQueries = {
  createMeetupSQLQuery,
  createQuestionSQLQuery,
  createUserSQLQuery,
  createRsvpSQLQuery
};

export default createTableSQLQueries;
