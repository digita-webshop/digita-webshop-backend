module.exports = new (class extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
})();
