import { Context } from 'hono';
import { Bindings, Variables } from './bindings';

export type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;

export const getDb = (c: AppContext) => c.env.DB;

export const withRequestId = (c: AppContext, next: () => Promise<void>) => {
  c.set('requestId', crypto.randomUUID());
  return next();
};

export const getRequestId = (c: AppContext) => c.get('requestId');
