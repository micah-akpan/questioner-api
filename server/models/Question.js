import db from '../db';

/**
 * @class Question
 */
class Question {
  /**
   * @constructor
   */

  /**
   * @method findAll
   * @param {*} options
   * @returns {Promise} Resolves to the questions query results
   */
  static async findAll(options) {
    const { orderBy, order } = options;
    // order [enum: asc|desc]
    if (Object.keys(options).length > 0) {
      switch (order) {
        case 'desc': {
          return db.queryDb({
            text: 'SELECT * FROM Question ORDER BY $1 DESC',
            values: [orderBy]
          });
        }

        default: {
          return db.queryDb({
            text: 'SELECT * FROM Question ORDER BY ASC',
            values: [orderBy]
          });
        }
      }
    }
  }

  /**
   * @method findByPk
   * @param {String|Number} pk Primary key column value
   * @returns {Promise} Resolves to the matched table record or to an error
   */
  static async findByPk(pk) {
    if (!pk) {
      return Promise.reject(new Error('Please specify a primary key column value'));
    }

    return db.queryDb({
      text: 'SELECT * FROM Question WHERE id=$1',
      values: [pk]
    });
  }
}

export default Question;
