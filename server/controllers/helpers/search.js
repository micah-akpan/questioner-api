/**
 * @module
 * Helper code specific to controllers
 */

export default {
  search(data, query, options = {
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
};
