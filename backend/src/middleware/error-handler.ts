import type { MiddlewareHandler } from 'hono';
import { handleError } from '../lib/errors';

export const errorHandler = (): MiddlewareHandler => async (c, next) => {
  try {
    await next();
  } catch (error) {
    const { message, statusCode, code } = handleError(error);
    return c.json({ 
      success: false,
      message, 
      errorCode: code,
      timestamp: new Date().toISOString()
    }, statusCode);
  }
};
