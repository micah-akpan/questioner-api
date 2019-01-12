import tableQueries from '../models/helpers';

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
    this.dbClient = dbClient;
    this.tableQueries = tableQueries;
  }

  /**
   * @method queryDb
   * @param {*} query An object with 2 required fields (text and values)
   * @returns {Promise<QueryResult>} Returns a promise of the results of the query operation
   */
  queryDb(query) {
    return this.dbClient.query(query);
  }

  /**
   * @method sync
   * @returns {String} Database tables sync success/failure message
   */
  async sync() {
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
   * @param {String} tableName
   * @returns {Promise} Returns a Promise that resolves to a table result or to a failure message
   */
  createTable(tableName) {
    const createTableQuery = this.tableQueries[tableName];
    return this.dbClient.query(createTableQuery);
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
      return this.dbClient.query(`DROP TABLE IF EXISTS ${tableName}`);
    }
    return this.dbClient.query(`DROP TABLE ${tableName}`);
  }
}

export default Db;
