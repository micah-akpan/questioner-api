import Model from './Model';
import db from '../../db';
import { arrayHasValues } from '../../utils';

/**
 * @class Downvote
 */
class Downvote extends Model {
  /**
     * @constructor
     */
  constructor() {
    super('Downvote', db);
  }

  /**
   * @method voteExist
   * @param {Number} userId
   * @param {Number} questionId
   * @returns {Promise<Boolean>} Resolves to true if vote exist, false otherwise
   */
  async voteExist(userId, questionId) {
    const votes = await this.find({
      where: {
        '"user"': userId,
        question: questionId
      }
    });
    if (arrayHasValues(votes)) {
      return true;
    }
    return false;
  }
}

export default new Downvote();
