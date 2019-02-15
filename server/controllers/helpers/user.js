/**
 * @module
 * @description User specific helpers
 */

export default (db, jwt) => ({
  /**
   * @func getUserPassword
   * @param {*} userPasswordConfig
   * @returns {Promise} Resolves to a queryResult for a user password
   */
  async getUserPassword({ condition, value }) {
    return db.queryDb({
      text: `SELECT password as encryptedPassword FROM "User" WHERE ${condition}=$1`,
      values: [value]
    });
  },

  /**
   * @func createUserError
   * @param {String} msg
   * @returns {Error} Returns a new error, specific to the User model
   */
  createUserError(msg) {
    return new Error(msg);
  },

  /**
   * @func obtainToken
   * @param {*} tokenConfig contains a payload, and expires in option
   * @returns {String} Returns a JWT token
   */
  obtainToken({ payload, expiresIn = '24h' }) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn
    });
  },

  /**
   * @func anotherUserWithUsernameExist
   * @param {String} username
   * @param {Number | String} userId
   * @returns {Promise<Boolean>} Resolves true if another user
   * with `username` exist, false otherwise
   */
  async anotherUserWithUsernameExist(username, userId) {
    try {
      const { rows } = await db.queryDb({
        text: 'SELECT * FROM "User" WHERE username=$1 AND id <> $2',
        values: [username, userId]
      });
      return rows.length > 0;
    } catch (e) {
      throw e;
    }
  },

  /**
   * @func anotherUserWithEmailExist
   * @param {String} email
   * @param {Number|String} userId
   * @returns {Promise<Boolean>} Resolves to true if another user
   * with `email` exist, false otherwise
   */
  async anotherUserWithEmailExist(email, userId) {
    try {
      const { rows } = await db.queryDb({
        text: 'SELECT * FROM "User" WHERE email=$1 AND id <> $2',
        values: [email, userId]
      });

      return rows.length > 0;
    } catch (e) {
      throw e;
    }
  }
});
