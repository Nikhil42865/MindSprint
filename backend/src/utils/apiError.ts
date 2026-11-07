export type ApiErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_QUESTION_DATA"
  | "QUESTION_BANK_UNAVAILABLE"
  | "NO_QUESTIONS_AVAILABLE"
  | "ROUTE_NOT_FOUND"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ApiErrorCode;

  public constructor(statusCode: number, code: ApiErrorCode, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}