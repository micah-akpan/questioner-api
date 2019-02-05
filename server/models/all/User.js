import Model from './Model';
import db from '../../db';
/**
 * @class User
 */
class User extends Model {
  /**
     * @constructor
     */
  constructor() {
    super('"User"', db);
  }

  /**
   * @param {*} payload
   * @returns {Promise} Resolves to the query result of the operation
   */
  async create({
    email, password, firstname, lastname
  }) {
    return this._db.queryDb({
      text: `INSERT INTO "User" (email,password,firstname,lastname)
                       VALUES ($1, $2, $3, $4) RETURNING id, firstname, lastname, 
                       email, othername, phonenumber as "phoneNumber", registered,
                       isadmin as "isAdmin", birthday, bio`,
      values: [email, password, firstname, lastname]
    });
  }
}

export default new User();
