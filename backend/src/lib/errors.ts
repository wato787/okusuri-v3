export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const createError = (message: string, statusCode: number = 500, code?: string) => {
  return new AppError(message, statusCode, code);
};

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode, code: error.code };
  }
  
  console.error('Unhandled error:', error);
  return { message: 'Internal server error', statusCode: 500 };
};
