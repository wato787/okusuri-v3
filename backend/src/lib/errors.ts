import { ERROR_CODES, HTTP_STATUS } from '@okusuri/shared';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const createError = (message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, code?: string) => {
  return new AppError(message, statusCode, code);
};

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode, code: error.code };
  }
  
  console.error('Unhandled error:', error);
  return { 
    message: 'Internal server error', 
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: ERROR_CODES.INTERNAL_ERROR
  };
};
