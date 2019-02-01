/**
 * @func sendResponse
 * @param {*} responseConfig An Hash with Express Server object, status code and payload fields
 * @returns {Response} Server Response body
 */
export const sendResponse = ({ res, status, payload }) => res
  .status(status)
  .send(payload);

export const sendServerErrorResponse = res => sendResponse({
  res,
  status: 500,
  payload: {
    status: 500,
    error: 'Invalid request, please check request and try again'
  }
});

export const nullToEmptyArray = array => array.map((obj) => {
  for (const field in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      if (obj[field] === null) {
        obj[field] = [];
      }
    }
  }

  return obj;
});

/* eslint-disable */
export const stripInnerNulls = array => array.map((obj) => {
  for (const field in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      if (Array.isArray(obj[field])) {
        const newArray = obj[field].filter(value => value !== null || typeof value !== 'undefined');
        obj[field] = newArray;
      }
    }
    return obj;
  }
});

export default {
  sendResponse
};
