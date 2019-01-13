
/* eslint-disable */
import db from '../db';

class Model {
    constructor(modelName) {
        this.name = modelName;
    }

    /**
     * @method findByPk
     * @param {Number} pk
     * @returns {Promise} Resolves to the found record or rejects with an error
     */
    static async findByPk(pk) {
        if (!pk) {
            return Promise.reject(new Error('Please specify a primary key column value'));
        }

        return db.queryDb({
            text: `SELECT * FROM ${this.name} WHERE id=$1`,
            values: [pk]
        });
    }

    /**
     * @method findAll
     * @returns {Promise} Resolves to the found records
     */
    static async findAll() {
        const { orderBy, order } = options;
        // order [enum: asc|desc]
        if (Object.keys(options).length > 0) {
            switch (order) {
                case 'desc': {
                    return db.queryDb({
                        text: `SELECT * FROM ${this.name} ORDER BY $1 DESC`,
                        values: [orderBy]
                    });
                }

                default: {
                    return db.queryDb({
                        text: `SELECT * FROM ${this.name} ORDER BY ASC`,
                        values: [orderBy]
                    });
                }
            }
        }
    }

    /**
     * @method findOneAndDelete
     * @param {Number} pk
     * @returns {Promise} Resolves to a delete op query result or rejects with an error 
     * if 'pk' is not provided or invalid
     */
    static async findOneAndDelete(pk) {
        if (!pk) {
            return Promise.reject(new Error('Please specify a primary key column value'));
        }

        const results = await db.queryDb({
            text: `SELECT * FROM ${this.name} WHERE id=$1`,
            values: [pk]
        });

        if (results.rows.length > 0) {
            return db.queryDb({
                text: `DELETE FROM ${this.name} WHERE id=$1`
            });
        }
    }

    /**
     * @method findOneAndUpdate
     * @param {Number} pk
     * @returns {Promise} Resolves to the update query op result or rejects with error
     * if 'pk' is not provided or is invalid
     */
    static async findOneAndUpdate(pk) {

    }

    /**
     * @method create
     * @param {*} payload
     * @returns {Promise} Resolves to the create query op result or rejects with error
     * if 'pk' is not provided or is invalid
     */
    static async create(payload) {

    }
}

export default Model;