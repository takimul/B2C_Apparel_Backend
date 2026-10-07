// export class AppError extends Error {
//   public readonly statusCode: number;
//   public readonly isOperational: boolean;

//   constructor(message: string, statusCode = 500, isOperational = true) {
//     super(message);

//     this.name = "AppError";
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;

//     Error.captureStackTrace(this, this.constructor);
//   }
// }
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
