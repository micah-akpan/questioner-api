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
    const { comment, questionId } = payload;
    const commentResult = await this._db.queryDb({
      text: `INSERT INTO Comment (body, question)
               VALUES ($1, $2) RETURNING *`,
      values: [comment, questionId]
    });

    return commentResult.rows[0];
  }
}

export default new Comment();
