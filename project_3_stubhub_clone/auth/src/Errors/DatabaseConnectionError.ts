export class DatabaseConnectionError extends Error {
  reason = "Error connecting to Database."

  constructor() {
    super()

    // since this class extends a built in class in the language...
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
}

// example:   throw new DatabaseConnectionError(errors)
