import tableQueries from '../models/schemas';
import { getPreparedStatementValues, getPreparedStatementColumns } from '../helpers';
/**
 * @class Db
 * @description DB specific operations
 */
class Db {
  /**
   * @constructor
   * @param {*} dbClient a DB client that supports the interface
   */
  constructor(dbClient) {
    this._dbClient = dbClient;
    this._tableQueries = tableQueries;
    this._tableNames = ['User', 'Meetup', 'Question', 'Comment',
      'Rsvp', 'Upvote', 'Downvote', 'Image'];
  }

  /**
   * @method queryDb
   * @param {*} query An object with 2 required fields (text and values)
   * @returns {Promise<QueryResult>} Returns a promise of the results of the query operation
   */
  queryDb(query) {
    return this._dbClient.query(query);
  }

  /**
   * @method sync
   * @returns {String} Database tables sync success/failure message
   */
  async sync() {
    /* eslint-disable no-await-in-loop */
    try {
      for (const tableName of this._tableNames) {
        await this.createTable(tableName);
      }
    } catch (e) {
      return Promise.reject(new Error('Table synchronization failed'));
    }

    return Promise.resolve('All tables synced to the database');
  }

  /**
   * @method createTable
   * @param {String} tableName
   * @returns {Promise} Returns a Promise that resolves to a table result or to a failure message
   */
  createTable(tableName) {
    const createTableQuery = this._tableQueries[tableName];
    return this.queryDb(createTableQuery);
  }

  /**
   * @method dropTable
   * @param {*} tableDropConfig
   * @returns {Promise} Returns a Promise that resolves to a table result or to a failure message
   */
  dropTable({ tableName, force = true }) {
    if (force) {
      // interpolation ideal here
      // since we are not feeding into this function
      // data from the 'user'
      return this._dbClient.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
    }
    return this._dbClient.query(`DROP TABLE ${tableName}`);
  }

  /* eslint-disable */
  truncate(tableName) {
    return this._dbClient.query(`DELETE FROM ${tableName}`);
  }

  /**
   * @method bulkInsert
   * @param {string} tableName 
   * @param {array} data
   * @returns {Promise} Resolves to a string 
   * confirming the successful operation of the
   * bulk insert operation
   */
  async bulkInsert(tableName, data) {
    try {
      const extractPropValues = (obj) => {
        return Object.values(obj);
      }
      /* eslint-disable no-await-in-loop */
      const columns = Object.keys(data[0]);
      for (const datum of data) {
        await this._dbClient.query({
          text: `INSERT INTO ${tableName} ${getPreparedStatementColumns(columns)}
                 VALUES ${getPreparedStatementValues(columns)}`,
          values: extractPropValues(datum)
        })
      }
      return Promise.resolve('Bulk insert completed...')
    } catch (ex) {
      console.error(ex);
    }
  }
  /**
   * @method close
   * @returns {*} Closes database connection
   */
  async close() {
    await this._dbClient.end();
  }
}

export default Db;
