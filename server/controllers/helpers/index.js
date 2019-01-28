/**
 * @func sendResponse
 * @param {*} responseConfig An Hash with Express Server object, status code and payload fields
 * @returns {Response} Server Response body
 */
export const sendResponse = ({ res, status, payload }) => res
  .status(status)
  .send(payload);

export default {
  sendResponse
};
