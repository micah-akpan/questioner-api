
import db from '../db';

/**
 * @class Model
 * @description base class for models
 */
class Model {
  /**
     * @constructor
     * @param {String} modelName
     */
  constructor(modelName) {
    this._name = modelName;
  }

  /**
     * @method findByPk
     * @param {Number} pk
     * @returns {Promise} Resolves to the found record or rejects with an error
     */
  async findByPk(pk) {
    if (!pk) {
      return Promise.reject(new Error('Please specify a primary key column value'));
    }

    return db.queryDb({
      text: `SELECT * FROM ${this._name} WHERE id=$1`,
      values: [pk]
    });
  }

  /**
     * @method findAll
     * @returns {Promise} Resolves to the found records
     */
  async findAll() {
    const { orderBy, order } = options;
    // order [enum: asc|desc]
    if (Object.keys(options).length > 0) {
      switch (order) {
        case 'desc': {
          return db.queryDb({
            text: `SELECT * FROM ${this._name} ORDER BY $1 DESC`,
            values: [orderBy]
          });
        }

        default: {
          return db.queryDb({
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

    const results = await db.queryDb({
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
     * @method findOneAndUpdate
     * @param {Number} pk
     * @returns {Promise} Resolves to the update query op result or rejects with error
     * if 'pk' is not provided or is invalid
     */
  async findOneAndUpdate(pk) {

  }

  /**
     * @method create
     * @param {*} payload
     * @returns {Promise} Resolves to the create query op result or rejects with error
     * if 'pk' is not provided or is invalid
     */
  async create(payload) {

  }
}

export default Model;
