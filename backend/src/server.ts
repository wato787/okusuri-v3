import { serve } from 'bun';
import app from './app';

const port = process.env.PORT || 3001;

console.log(`🚀 バックエンドサーバーが起動しました: http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});