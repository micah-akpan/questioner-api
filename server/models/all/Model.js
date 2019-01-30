
import db from '../../db';
import { getLastElement, arrayHasValues } from '../../utils';

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
  constructor(modelName) {
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

    return db.queryDb({
      text: `SELECT * FROM ${this._name} WHERE id=$1`,
      values: [id]
    });
  }

  /**
   * @method findAll
   * @param {*} options
   * @returns {Promise} Resolves to the found records
   */
  async findAll(options) {
    const { orderBy, order } = options;
    // order [enum: asc|desc]
    if (Object.keys(options).length > 0) {
      switch (order) {
        case 'desc': {
          return this._db.queryDb({
            text: `SELECT * FROM ${this._name} ORDER BY $1 DESC`,
            values: [orderBy]
          });
        }

        default: {
          return this._db.queryDb({
            text: `SELECT * FROM ${this._name} ORDER BY ASC`,
            values: [orderBy]
          });
        }
      }
    }
  }

  /**
     * @method findOneAndDelete
     * @param {Number} pk
     * @returns {Promise} Resolves to a delete op query result or rejects with an error
     * if 'pk' is not provided or invalid
     */
  async findOneAndDelete(pk) {
    if (!pk) {
      return Promise.reject(new Error('Please specify a primary key column value'));
    }

    const results = await this._db.queryDb({
      text: `SELECT * FROM ${this._name} WHERE id=$1`,
      values: [pk]
    });

    if (results.rows.length > 0) {
      return db.queryDb({
        text: `DELETE FROM ${this._name} WHERE id=$1`
      });
    }
  }

  /**
   * @method find
   * @param {*} fields An hash of column names to filter by
   * @param {String} op OR|AND
   * @returns {Promise} Returns a Promise that resolves to the
   * result of the query
   */
  async find(fields, op) {
    const columnNames = Object.keys(fields);
    const _supportedOps = ['OR', 'AND'];

    if (columnNames.length > 1) {
      // Multiple query fields with no operator
      if (typeof op !== 'string') {
        return Promise.reject(new Error('Query operator must be a string'));
      }

      if (!(_supportedOps.includes(op))) {
        return Promise.reject(new Error('Please provide a valid operator(OR|AND)'));
      }
    }

    const queryString = this.makeQueryString(columnNames, op);
    const queryValues = columnNames.map(columnName => fields[columnName]);
    return db.queryDb({
      text: queryString,
      values: queryValues
    });
  }

  /**
   * @func makeQueryString
   * @param {*} columnNames columnNames is an array of table column names
   * @param {String} op OR|AND
   * @returns {String} A query string
   */
  makeQueryString(columnNames, op) {
    let queryString = `SELECT * FROM ${this._name} WHERE `;
    let count = 1; // keeps track of the prepared query variables
    columnNames.forEach((columnName) => {
      queryString += `${columnName}=$${count} ${getLastElement(columnNames) !== columnName
        ? op : ''} `;
      count += 1;
    });

    return queryString;
  }

  /**
     * @method findOneAndUpdate
     * @param {Number} pk
     * @returns {Promise} Resolves to the update query op result or rejects with error
     * if 'pk' is not provided or is invalid
     */
  /* eslint-disable */
  async findOneAndUpdate(pk) {

  }

  async recordExist(id) {
    const recordResult = await this.findById(id);
    if (arrayHasValues(recordResult.rows)) {
      return true;
    }
    return false;
  }

  /**
     * @method create
     * @param {*} payload
     * @returns {Promise} Resolves to the create query op result or rejects with error
     * if 'pk' is not provided or is invalid
     */
  async create(payload) {
    return new Promise((resolve, reject) => {
      if (!payload) {
        reject(new Error('Please provide a payload'))
      }
    })
  }
}

export default Model;
