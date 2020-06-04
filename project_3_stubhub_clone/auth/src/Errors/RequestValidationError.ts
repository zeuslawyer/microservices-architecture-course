import { ValidationError } from "express-validator";

import { CustomErrorBase } from "./CustomErrorBase";

export class RequestValidationError extends CustomErrorBase {
  statusCode = 400;
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super("Request Validation Error");
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
