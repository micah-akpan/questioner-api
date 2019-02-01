import { getLastElement } from '../../utils';

/**
 * @class Model
 * @description base class for models
 */
class Model {
  /**
     * @constructor
     * @param {String} modelName
     * @param {*} db
     */
  constructor(modelName, db) {
    this._name = modelName;
    this._db = db;
  }

  /**
     * @method findById
     * @param {Number} id Primary key value
     * @returns {Promise} Resolves to the found record or rejects with an error
     */
  async findById(id) {
    if (!id) {
      return Promise.reject(new Error('Please specify a primary key column value'));
    }

    const queryResult = await this._db.queryDb({
      text: `SELECT * FROM ${this._name} WHERE id=$1`,
      values: [id]
    });
    return queryResult.rows[0];
  }

  /**
     * @method findOneAndDelete
     * @param {Number} id
     * @returns {Promise} Resolves to a delete op query result or rejects with an error
     * if 'pk' is not provided or invalid
     */
  async findOneAndDelete(id) {
    if (!id) {
      return Promise.reject(new Error('Please specify a primary key column value'));
    }

    const queryResult = await this._db.queryDb({
      text: `SELECT * FROM ${this._name} WHERE id=$1`,
      values: [id]
    });

    if (queryResult.rows.length > 0) {
      return this._db.queryDb({
        text: `DELETE FROM ${this._name} WHERE id=$1`
      });
    }
  }

  /**
   * @method find
   * @param {*} criteria
   * @returns {Promise} Returns a Promise that resolves to the
   * result of the query
   */
  async find(criteria) {
    const { where } = criteria;
    const columnNames = Object.keys(where);

    const queryString = this.makeQueryString(columnNames);
    const queryValues = columnNames.map(columnName => where[columnName]);

    const queryResult = await this._db.queryDb({
      text: queryString,
      values: queryValues
    });

    return queryResult.rows;
  }

  /**
   * @func makeQueryString
   * @param {*} columnNames columnNames is an array of table column names
   * @returns {String} A query string
   */
  makeQueryString(columnNames) {
    let queryString = `SELECT * FROM ${this._name} WHERE `;
    let count = 1; // keeps track of the prepared query variables
    const defaultOp = 'AND';
    columnNames.forEach((columnName) => {
      queryString += `${columnName}=$${count} ${getLastElement(columnNames) !== columnName
        ? defaultOp : ''} `;
      count += 1;
    });

    return queryString;
  }

  /**
   * @method recordExist
   * @param {Number} id Primary key value
   * @returns {Promise<Boolean>} Returns true if record exist, false otherwise
   */
  async recordExist(id) {
    const record = await this.findById(id);
    if (record) {
      return true;
    }
    return false;
  }

  /* eslint-disable */
  /**
     * @method create
     * @param {*} payload
     * @returns {Promise} Resolves to the create query op result 
     * or rejects with error if 'pk' is not provided or is invalid
     */
  async create(payload) {

  }
}

export default Model;
