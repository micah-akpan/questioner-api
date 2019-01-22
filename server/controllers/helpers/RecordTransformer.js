/**
 * @class RecordTransformer
 * @description Takes a list of objects and transforms the objects based on an
 * action'
 */
class RecordTransformer {
  /**
   * @func transform
   * @param {Array} records
   * @param {String} field
   * @param {String} action
   * @returns {Array} Array with its items transformed
   */
  static transform(records, field, action) {
    switch (action) {
      case 'remove-nulls': {
        const newRecords = records.map((record) => {
          if (record[field] === null) {
            delete record[field];
          }

          return record;
        });

        return newRecords;
      }

      case 'nulls-to-empty-array': {
        const newRecords = records.map((record) => {
          if (record[field] === null) {
            record[field] = [];
          }

          return record;
        });

        return newRecords;
      }

      case 'inner-nulls-with-empty-string': {
        const newRecords = records.map((record) => {
          const values = record[field].map((value) => {
            if (value === null) {
              value = '';
            }

            return value;
          });

          record[field] = values;

          return record;
        });

        return newRecords;
      }

      default: {
        return records;
      }
    }
  }
}

export default RecordTransformer;
