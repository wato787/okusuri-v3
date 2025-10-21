import type { MiddlewareHandler } from 'hono';
import { handleError } from '../lib/errors';

export const errorHandler = (): MiddlewareHandler => async (c, next) => {
  try {
    await next();
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return c.json({ error: message }, statusCode);
  }
};
