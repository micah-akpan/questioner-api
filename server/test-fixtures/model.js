/* eslint-disable */

class Model {
  constructor(name, db) {
    this._db = db;
    this._name = name;
  }

  async findById(id) {
    if (!id) {
      return Promise.reject(new Error('Please specify a primary key column value'));
    }
    const query = {
      text: `SELECT * FROM ${this._name} WHERE id=$1`,
      values: [id]
    };
    const queryResult = await this._db.queryDb(query);
    return queryResult.rows[0];
  }

  async findOneAndDelete(id) {
    if (!id) {
      return Promise.reject(new Error('Please specify a primary key column value'));
    }
    const query = {
      text: `DELETE FROM ${this._name} WHERE id=$1`,
      values: [id]
    };
    const queryResult = await this._db.queryDb(query);
    return queryResult.rows[0];
  }
}

export default Model;
