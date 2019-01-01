/**
 * @module
 * Helper code specific to app controllers
 */

import _ from 'lodash';

/**
  * @method search
  * @param {Array} data
  * @param {String} searchBy
  * @param {String} searchTerm
  * @returns {Array} array of objects that match the criteria specified in 'query'
*/
export const search = (data, searchBy, searchTerm) => {
  const criteriaType = typeof searchBy;
  if (criteriaType !== 'string') {
    throw new TypeError(
      `Wrong argument type: ${criteriaType}. Search Criteria argument must be a string`
    );
  }
  const matches = [];
  data.forEach((obj) => {
    searchTerm.split(' ').forEach((str) => {
      const regExp = new RegExp(str, 'ig');
      if (Array.isArray(obj[searchBy])) {
        if (obj[searchBy].includes(str)) {
          matches.push(obj);
        }
      } else {
        /* eslint no-lonely-if:0 */
        if (regExp.test(obj[searchBy])) {
          matches.push(obj);
        }
      }
    });
  });
  return _.uniqBy(matches, 'id');
};

export default {
  search
};
