class ConflictError extends Error {
  constructor(msg) {
    super(msg);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
