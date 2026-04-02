// Base application error to standardize error handling across use cases
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code = 'VALIDATION_ERROR') {
    super(message, code);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code = 'NOT_FOUND') {
    super(message, code);
    this.name = 'NotFoundError';
  }
}

export class InsufficientBalanceError extends AppError {
  constructor(message = 'Saldo insuficiente', code = 'INSUFFICIENT_BALANCE') {
    super(message, code);
    this.name = 'InsufficientBalanceError';
  }
}
