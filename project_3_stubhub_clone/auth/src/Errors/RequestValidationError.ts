import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  statusCode = 400;
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super();
    this.errors = errors;

    // as we are extending a base class included in the language...
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(e => {
      return {
        message: e.msg,
        field: e.param
      };
    });
  }
}

// example : throw new RequestValidationError(errors)
