/**
 * @module
 * @description User specific helpers
 */

export default (db, jwt) => ({
  async getUserPassword({ condition, value }) {
    return db.queryDb({
      text: `SELECT password as encryptedPassword FROM "User" WHERE ${condition}=$1`,
      values: [value]
    });
  },

  createUserError(msg) {
    return new Error(msg);
  },

  obtainToken({ payload, expiresIn = '24h' }) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn
    });
  },

  async userExist({ condition, value }) {
    return db.queryDb({
      text: `SELECT * FROM "User" WHERE ${condition}=$1`,
      values: [value]
    });
  }
});
