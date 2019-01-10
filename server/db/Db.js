import logger from '../helpers';
import tableQueries from '../models/helpers';

/**
 * @class DB
 * @description DB specific operations
 */
class Db {
  /**
   * @constructor
   * @param {*} dbClient a DB client that supports the interface
   */
  constructor(dbClient) {
    this.dbClient = dbClient;
    this.tableQueries = tableQueries;
  }

  /**
   * @param {*} query An object with 2 required fields (text and values)
   * @returns {Promise<QueryResult>} Returns a promise of the results of the query operation
   */
  static queryDb(query) {
    return this.dbClient.query(query);
  }

  /**
   * @returns {String} Database tables sync success/failure message
   */
  async sync() {
    // drops and creates all tables
    try {
      await this.createTable({ tableName: 'User' });
      await this.createTable({ tableName: 'Meetup' });
      await this.createTable({ tableName: 'Question' });
      await this.createTable({ tableName: 'Comment' });
      await this.createTable({ tableName: 'Rsvp' });
    } catch (e) {
      return Promise.reject(new Error('Table synchronization failed'));
    }

    return Promise.resolve('All tables synced to the database');
  }

  /**
   * @method createTable
   * @param {*} tableCreationConfig
   * @returns {Promise} Returns a Promise that resolves to a table result or to a failure message
   */
  createTable({ tableName, force = true }) {
    try {
      if (force) {
        const createTableQuery = this.tableQueries[tableName];
        // return pool.query(createTableQuery);
        return this.dbClient.query(createTableQuery);
      }
    } catch (e) {
      logger.log({
        level: 'error',
        error: e
      });

      return Promise.reject(new Error(`${tableName} creation failed`));
    }
  }

  /**
   * @method dropTable
   * @param {*} tableDropConfig
   * @returns {Promise} Returns a Promise that resolves to a table result or to a failure message
   */
  dropTable({ tableName, force = true }) {
    try {
      if (force) {
        // interpolation ideal here
        // since we are not feeding into this function
        // data from the 'user'
        return this.dbClient.query(`DROP TABLE IF EXISTS ${tableName}`);
      }
      return this.dbClient.query(`DROP TABLE ${tableName}`);
    } catch (e) {
      logger.log({
        level: 'error',
        error: e
      });

      return Promise.reject(new Error(`${tableName} creation failed`));
    }
  }

  /**
   * @method truncateAllRecords
   * @param {*} tableTruncateConfig
   * @returns {Promise} Resolves to the truncated table or a failure message
   */
  truncateAllRecords({ tableName }) {
    try {
      return this.dbClient.query(`DELETE FROM ${tableName}`);
    } catch (e) {
      logger.log({
        level: 'error',
        error: e
      });

      return Promise.reject(new Error('Data records delete operation failed'));
    }
  }
}

export default Db;
