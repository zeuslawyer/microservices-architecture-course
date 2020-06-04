import { CustomErrorBase } from "./CustomErrorBase";

export class DatabaseConnectionError extends CustomErrorBase {
  reason = "Error connecting to Database.";
  statusCode = 500;

  constructor() {
    super("Database error");

    // since this class extends a built in class in the language...
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

// example:   throw new DatabaseConnectionError(errors)
