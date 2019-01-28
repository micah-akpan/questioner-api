export const sendResponse = ({ res, status, payload }) => res
  .status(status)
  .send(payload);

export const sendServerErrorResponse = () => {
  // TO BE IMPLEMENTED
};

export default {
  sendResponse
};
