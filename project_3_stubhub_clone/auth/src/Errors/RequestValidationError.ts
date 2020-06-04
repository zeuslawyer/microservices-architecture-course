import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // as we are extending a base class included in the language...
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}

// example : throw new RequestValidationError(errors)
