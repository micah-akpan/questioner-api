/**
 * @class Search
 * @description Search related statics
 */
class Search {
  /**
   * @method search
   * @param {Array} data
   * @param {*} query object whose fields map to the criteria to be used for the search
   * @param {*} options object with a special 'by' field with possible values
   * title, topic, location and tags
   * @return {Array} array of objects that match the criteria specified in 'query'
   */
  static search(data, query, options = {
    by: 'topic'
  }) {
    const searchValue = query.searchTerm.toLowerCase();
    if (options.by === 'tags') {
      return data.filter(d => d[options.by].includes(searchValue));
    }

    return data.filter(
      d => d[options.by].toLowerCase().match(searchValue)
    );
  }
}

export default Search;
