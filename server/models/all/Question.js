/* eslint-disable */
import Model from './Model';
import db from '../../db';
/**
 * @class Question
 */
class Question extends Model {
  /**
   * @constructor
   */
  constructor() {
    super('Question', db);
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
    const question = await this.findById(questionId);
    return question.votes;
  }

  /**
   * @method sortQuestionByVotes
   * @returns { Promise<Array> } An array of questions
   */
  async findAndSortByVotes() {
    const questionsResult = await this._db.queryDb({
      text: 'SELECT id, title, body, meetup, votes, createdby as "createdBy", createdon as "createdOn" FROM Question ORDER BY votes DESC'
    });

    return questionsResult.rows;
  }

  async findById(questionId) {
    const results = await this._db.queryDb({
      text: 'SELECT * FROM Question WHERE id=$1',
      values: [questionId]
    });

    return results.rows[0];
  }
}

export default new Question();
