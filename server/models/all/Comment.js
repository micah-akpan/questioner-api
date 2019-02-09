/* eslint-disable */
import Model from './Model';
import db from '../../db';

/**
 * @class Comment
 */
class Comment extends Model {
  /**
   * @constructor
   */
  constructor() {
    super('Comment', db);
  }

  async create(payload) {
    const { comment, questionId, userId } = payload;
    const commentResult = await this._db.queryDb({
      text: `INSERT INTO Comment (body, question, createdBy)
               VALUES ($1, $2, $3) RETURNING *`,
      values: [comment, questionId, userId]
    });

    return commentResult.rows[0];
  }
}

export default new Comment();
