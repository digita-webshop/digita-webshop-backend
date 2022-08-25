// module.exports = new (class extends Error {
//   constructor(message, errorCode) {
//     super(message);
//     this.code = errorCode;
//   }
// })();
const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};
module.exports = createError;
