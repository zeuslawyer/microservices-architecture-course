export abstract class CustomErrorBase extends Error {
  abstract statusCode: number;

  constructor(errorMsg: string) {
    super(errorMsg);
    Object.setPrototypeOf(this, CustomErrorBase.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
