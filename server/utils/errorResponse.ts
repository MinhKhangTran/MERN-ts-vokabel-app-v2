class ErrorResponse extends Error {
  constructor(public message: string | any, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;
