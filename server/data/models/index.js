import db from '../../db';
import createTableQueries from './helpers';

const {
  createMeetupSQLQuery,
  createUserSQLQuery,
  createQuestionSQLQuery,
  createRsvpSQLQuery
} = createTableQueries;

export default {
  async createTable(query) {
    db.queryDb(query)
      .then(() => {
        console.log('Table has been created successfully');
      })
      .catch((err) => {
        console.error(err);
      });

    try {
      await db.queryDb(query);
    } catch (e) {
      console.log(e);
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
      console.log('All tables has been created successfully');
    } catch (e) {
      console.error(e);
    }
  }
};
