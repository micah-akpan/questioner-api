import Model from './Model';

/**
 * @class Question
 */
class Question extends Model {
  /**
   * @constructor
   */
  constructor() {
    super('Question');
  }

  /**
   * @method create
   * @param {*} payload
   * @returns {Promise} Resolves to the result of the newly created record
   */
  async create(payload) {
    const {
      title, body, meetupId, userId
    } = payload;
    return this._db.queryDb({
      text: `INSERT INTO ${this._name} (title, body, meetup, createdBy)
             VALUES ($1, $2, $3, $4) RETURNING createdBy as user, id, meetup, title, body`,
      values: [title, body, meetupId, userId]
    });
  }

  /**
   * @param {Number} questionId
   * @returns {Promise} Resolves true if question Exist, false otherwise
   */
  async questionExist(questionId) {
    return this.recordExist(questionId);
  }

  /**
   * @method getVotes
   * @param {Number} questionId
   * @returns {Number} Total votes of this question
   */
  async getVotes(questionId) {
    const questionResult = await this.findById(questionId);
    const question = questionResult.rows[0];
    return question.votes;
  }
}

export default new Question();
