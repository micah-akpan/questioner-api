export const sendResponse = ({ res, status, payload }) => res
  .status(status)
  .send(payload);


export default {
  sendResponse
};
