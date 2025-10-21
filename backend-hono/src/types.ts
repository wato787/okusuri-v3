import { Hono } from 'hono';

import { Bindings, Variables } from './context/bindings';

export type App = Hono<{ Bindings: Bindings; Variables: Variables }>;
