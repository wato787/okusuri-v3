import { Hono } from 'hono';

import type { Bindings, Variables } from '../../context/bindings';

const health = new Hono<{ Bindings: Bindings; Variables: Variables }>();

health.get('/', (c) => c.json({ status: 'ok' }));

export const healthRoutes = health;
