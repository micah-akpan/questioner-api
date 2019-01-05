import db from '../../db';
import createTableQueries from './helpers';

const {
  createMeetupSQLQuery,
  createUserSQLQuery,
  createQuestionSQLQuery,
  createRsvpSQLQuery
} = createTableQueries;

export default {
  createTable: (query) => {
    db.queryDb(query)
      .then(() => {
        console.log('Table has been created successfully');
      })
      .catch((err) => {
        console.error(err);
      });
  },

  createTables: async () => {
    // to ensure referencing tables
    // are created right after referenced ones
    try {
      await db.queryDb(createMeetupSQLQuery);
      await db.queryDb(createUserSQLQuery);
      await db.queryDb(createQuestionSQLQuery);
      await db.queryDb(createRsvpSQLQuery);
      console.log('All tables hae been created successfully');
    } catch (e) {
      console.error(e);
    }
  }
};
