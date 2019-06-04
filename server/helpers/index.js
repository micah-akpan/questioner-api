/**
 * @module
 * @description Helper code/data generic to all modules
 */

import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: []
});

export const getPreparedStatementValues = (columns) => {
  let preparedString = '(';
  let count = 1;
  // eslint-disable-next-line no-unused-vars
  columns.forEach((column) => {
    preparedString += `$${count},`;
    count += 1;
  });
  const subsetStr = preparedString.substring(0, preparedString.lastIndexOf(','));
  preparedString = `${subsetStr})`;
  return preparedString;
};

export const getPreparedStatementColumns = (columnNames) => {
  let preparedString = '(';
  columnNames.forEach((column) => {
    preparedString += `${column},`;
  });
  const subsetStr = preparedString.substring(0, preparedString.lastIndexOf(','));
  preparedString = `${subsetStr})`;
  return preparedString;
};


if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
