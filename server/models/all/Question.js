import Model from '.';

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
}

export default new Question();
