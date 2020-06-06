import { CustomErrorBase } from "./CustomErrorBase";

export class BadRequestError extends CustomErrorBase {
  statusCode = 402;
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;

    // extending builtin class of javascript so...
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.message
      }
    ];
  }
}
