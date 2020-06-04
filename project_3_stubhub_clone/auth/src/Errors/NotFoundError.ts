import { CustomErrorBase } from "./CustomErrorBase";

export class NotFoundError extends CustomErrorBase {
  statusCode = 404;
  reason = "Sorry, we could not find this resource.";

  constructor() {
    super("Resource not found.");
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
