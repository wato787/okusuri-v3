import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { Bindings, Variables } from './context/bindings';
import { withRequestId } from './context/helpers';
import { errorHandler } from './middleware/error-handler';
import { registerRoutes } from './routes';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(logger());
app.use(cors());
app.use('*', errorHandler());
app.use('*', async (c, next) => withRequestId(c, next));

registerRoutes(app);

export default app;
