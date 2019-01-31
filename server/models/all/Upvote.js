import Model from './Model';
import db from '../../db';
import { arrayHasValues } from '../../utils';

/**
 * @class Upvote
 */
class Upvote extends Model {
  /**
   * @constructor
   */
  constructor() {
    super('Upvote', db);
  }

  /**
   * @func voteExist
   * @param {Number} userId
   * @param {Number} questionId
   * @return {Promise<Boolean>} A promise that resolves to true if vote exist, false otherwise
   */
  async voteExist(userId, questionId) {
    const voteResult = await this.find({
      where: {
        '"user"': userId,
        question: questionId
      }
    });
    if (arrayHasValues(voteResult.rows)) {
      return true;
    }
    return false;
  }

  /**
   * @func create
   * @param {Number} userId
   * @param {Number} questionId
   * @returns {Promise} Resolves to the result of the query
   */
  async create(userId, questionId) {
    return this._db.queryDb({
      text: `INSERT INTO Upvote ("user", question)
             VALUES ($1, $2)`,
      values: [userId, questionId]
    });
  }
}

export default new Upvote();
