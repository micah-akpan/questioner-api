import db from '../db';
import createTableQueries from './helpers';
import logger from '../helpers';

const {
  createMeetupSQLQuery,
  createUserSQLQuery,
  createQuestionSQLQuery,
  createRsvpSQLQuery
} = createTableQueries;

export default {
  async createTable(query) {
    try {
      await db.queryDb(query);
      logger.log({
        level: 'info',
        message: 'Table created successfully'
      });
    } catch (e) {
      logger.log({
        level: 'error',
        message: e.message
      });
    }
  },

  async createTables() {
    // to ensure referencing tables
    // are created right after referenced ones
    try {
      await db.queryDb(createMeetupSQLQuery);
      await db.queryDb(createUserSQLQuery);
      await db.queryDb(createQuestionSQLQuery);
      await db.queryDb(createRsvpSQLQuery);

      logger.log({
        level: 'info',
        message: 'Tables created successfully'
      });
    } catch (e) {
      logger.log({
        level: 'error',
        message: e.message
      });
    }
  }
};
