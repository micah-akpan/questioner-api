/* eslint-disable */

const data = [
  {
    id: 1
  },

  {
    id: 2
  },

  {
    id: 3
  }
];

const db = {
  queryDb: (query) => {
    const result = {
      rows: data
    };
    return Promise.resolve(result);
  }
}

export default db;
