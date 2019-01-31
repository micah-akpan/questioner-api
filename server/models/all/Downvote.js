import Model from './Model';
import { arrayHasValues } from '../../utils';

/**
 * @class Downvote
 */
class Downvote extends Model {
  /**
     * @constructor
     */
  constructor() {
    super('Downvote');
  }

  /**
   * @method voteExist
   * @param {Number} userId
   * @param {Number} questionId
   * @returns {Promise<Boolean>} Resolves to true if vote exist, false otherwise
   */
  async voteExist(userId, questionId) {
    // TODO: Refactor this method into a new class
    const voteResult = await this.find({ '"user"': userId, question: questionId }, 'AND');
    console.log(this._name);
    console.log(voteResult.rows);
    if (arrayHasValues(voteResult.rows)) {
      return true;
    }

    return false;
  }
}

export default new Downvote();
