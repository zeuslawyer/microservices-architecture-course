import { CustomErrorBase } from "./CustomErrorBase";

export class NoAuthError extends CustomErrorBase {
  statusCode = 401;

  constructor() {
    super(" User Not Authorized! ");

    // extending builtin class of javascript so...
    Object.setPrototypeOf(this, NoAuthError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: "Not Authorized."
      }
    ];
  }
}
