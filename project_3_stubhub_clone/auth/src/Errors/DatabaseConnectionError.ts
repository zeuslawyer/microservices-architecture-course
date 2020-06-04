export class DatabaseConnectionError extends Error {
  reason = "Error connecting to Database.";
  statusCode = 500;

  constructor() {
    super();

    // since this class extends a built in class in the language...
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

// example:   throw new DatabaseConnectionError(errors)
