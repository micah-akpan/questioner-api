import { Pool } from 'pg';
import dbConfig from '../models/config';
import tableQueries from '../models/helpers';
import logger from '../helpers';

const connInfo = dbConfig[process.env.NODE_ENV || 'development'];

const pool = new Pool(connInfo);

/**
 * @module dbQueryInterface
 */
export default {
  /**
   * @param {*} query An object with 2 required fields (text and values)
   * @returns {Promise<QueryResult>} Returns a promise of the results of the query operation
   */
  queryDb: query => pool.query(query),

  /**
   * @returns {String} Database tables sync success/failure message
   */
  async sync() {
    // creates all tables
    const {
      createCommentSQLQuery,
      createQuestionSQLQuery,
      createUserSQLQuery,
      createRsvpSQLQuery,
      createMeetupSQLQuery
    } = tableQueries;
    try {
      await pool.query(createCommentSQLQuery);
      await pool.query(createQuestionSQLQuery);
      await pool.query(createUserSQLQuery);
      await pool.query(createRsvpSQLQuery);
      await pool.query(createMeetupSQLQuery);

      logger.log({
        level: 'info',
        message: 'All tables created successfully'
      });
    } catch (e) {
      logger.log({
        level: 'error',
        error: e
      });

      return 'Tables synchronization failed';
    }

    return 'All tables synced to the database';
  },

  async drop({ tableName, force = true, verbose = false }) {
    try {
      if (force) {
        // interpolation ideal here
        // since we are not feeding into this function
        // data from the 'user'
        await pool.query(`DROP TABLE IF EXISTS ${tableName}`);
      } else {
        await pool.query(`DROP TABLE ${tableName}`);
      }
    } catch (e) {
      logger.log({
        level: 'error',
        error: e
      });

      return 'Table drop operation failed';
    }

    if (verbose) {
      logger.log({
        level: 'info',
        message: `${tableName} drop operation was successful`
      });
    }

    return 'Table drop operation was successful';
  },

  async truncateAllRecords({ tableName, verbose = false }) {
    try {
      await pool.query(`DELETE FROM ${tableName}`);
    } catch (e) {
      logger.log({
        level: 'error',
        error: e
      });

      return 'Data records delete operation failed';
    }

    if (verbose) {
      logger.info('Data records delete operation was successful');
    }
  }
};
