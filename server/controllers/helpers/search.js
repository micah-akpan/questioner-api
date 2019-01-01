import _ from 'lodash';

/**
 * @module Search
 * @description Search related statics
 */
export default {

  /**
   * @method search
   * @param {Array} data
   * @param {String} searchBy
   * @param {String} searchTerm
   * @returns {Array} array of objects that match the criteria specified in 'query'
   */
  search(data, searchBy, searchTerm) {
    const matches = [];
    data.forEach((obj) => {
      searchTerm.split(' ').forEach((str) => {
        const regExp = new RegExp(str, 'ig');
        if (Array.isArray(obj[searchBy])) {
          if (obj[searchBy].includes(str)) {
            matches.push(obj);
          }
        } else if (typeof obj[searchBy] === 'string') {
          if (regExp.test(obj[searchBy])) {
            matches.push(obj);
          }
        }
      });
    });
    return _.uniqBy(matches, 'id');
  }
};
