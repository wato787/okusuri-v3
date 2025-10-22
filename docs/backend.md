# バックエンド開発

お薬管理アプリのバックエンド開発について説明します。

## 🏗️ アーキテクチャ概要

### 技術スタック

- **フレームワーク**: Hono
- **ランタイム**: Cloudflare Workers
- **データベース**: Drizzle ORM + Cloudflare D1
- **バリデーション**: Zod
- **言語**: TypeScript

### ディレクトリ構造

```
backend/
├── src/
│   ├── app.ts                 # アプリケーションエントリーポイント
│   ├── context/              # コンテキスト定義
│   │   ├── bindings.ts       # Cloudflare Workers バインディング
│   │   └── helpers.ts        # ヘルパー関数
│   ├── db/                   # データベース関連
│   │   ├── schema.ts         # スキーマ定義
│   │   └── tables/           # テーブル定義
│   ├── features/             # 機能別モジュール
│   │   ├── health/           # ヘルスチェック
│   │   ├── medication/       # 薬のログ管理
│   │   └── notification/     # 通知管理
│   ├── lib/                  # ライブラリ
│   │   ├── auth.ts           # 認証関連
│   │   └── errors.ts         # エラー定義
│   ├── middleware/           # ミドルウェア
│   │   └── error-handler.ts  # エラーハンドラー
│   ├── repositories/         # データアクセス層
│   ├── routes/               # ルート定義
│   └── types.ts              # 型定義
├── package.json
└── tsconfig.json
```

## 🚀 アプリケーション設定

### エントリーポイント (app.ts)

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { Bindings, Variables } from './context/bindings';
import { withRequestId } from './context/helpers';
import { errorHandler } from './middleware/error-handler';
import { registerRoutes } from './routes';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ミドルウェアの設定
app.use(logger());
app.use(cors());
app.use('*', errorHandler());
app.use('*', async (c, next) => withRequestId(c, next));

// ルートの登録
registerRoutes(app);

export default app;
```

### コンテキスト定義

#### bindings.ts

```typescript
export interface Bindings {
  DB: D1Database;
  // その他のCloudflare Workersバインディング
}

export interface Variables {
  requestId: string;
  // その他の変数
}
```

#### helpers.ts

```typescript
export const withRequestId = async (c: Context, next: Next) => {
  const requestId = crypto.randomUUID();
  c.set('requestId', requestId);
  await next();
};
```

## 🗄️ データベース層

### Drizzle ORM設定

#### テーブル定義例

```typescript
// db/tables/users.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

#### スキーマ統合

```typescript
// db/schema.ts
export * from './tables';
```

### リポジトリパターン

```typescript
// repositories/medication.ts
import { db } from '../db';
import { medicationLogs } from '../db/tables';

export class MedicationRepository {
  async create(data: CreateMedicationLogData) {
    return await db.insert(medicationLogs).values(data).returning();
  }

  async findById(id: string) {
    return await db.select().from(medicationLogs).where(eq(medicationLogs.id, id));
  }

  async findByMedicationId(medicationId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return await db
      .select()
      .from(medicationLogs)
      .where(eq(medicationLogs.medicationId, medicationId))
      .limit(limit)
      .offset(offset);
  }
}
```

## 🛣️ ルーティング

### ルート登録

```typescript
// routes/index.ts
import type { App } from '../types';
import { healthRoutes } from '../features/health/router';
import { medicationRoutes } from '../features/medication/router';
import { notificationRoutes } from '../features/notification/router';

export const registerRoutes = (app: App) => {
  app.route('/api/health', healthRoutes);
  app.route('/api/medication-log', medicationRoutes);
  app.route('/api/notification', notificationRoutes);
};
```

### 機能別ルーター

```typescript
// features/medication/router.ts
import { Hono } from 'hono';
import { createHandler } from './handlers/create';
import { getHandler } from './handlers/get';
import { listHandler } from './handlers/list';
import { updateHandler } from './handlers/update';

export const medicationRoutes = new Hono();

medicationRoutes.get('/', listHandler);
medicationRoutes.get('/:id', getHandler);
medicationRoutes.post('/', createHandler);
medicationRoutes.put('/:id', updateHandler);
```

## 🎯 ハンドラー

### ハンドラーの基本構造

```typescript
// features/medication/handlers/create.ts
import { Context } from 'hono';
import { MedicationRepository } from '../../../repositories/medication';
import { createMedicationLogSchema } from '../schemas';

export const createHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = createMedicationLogSchema.parse(body);
    
    const repository = new MedicationRepository();
    const result = await repository.create(validatedData);
    
    return c.json({
      success: true,
      data: result[0],
      message: '薬のログを作成しました',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      success: false,
      message: '薬のログの作成に失敗しました',
      errorCode: 'CREATE_FAILED',
      timestamp: new Date().toISOString(),
    }, 500);
  }
};
```

### バリデーション

```typescript
// features/medication/schemas/index.ts
import { z } from 'zod';

export const createMedicationLogSchema = z.object({
  medicationId: z.string().min(1, '薬のIDは必須です'),
  takenAt: z.string().datetime('有効な日時を入力してください'),
  notes: z.string().optional(),
});

export const updateMedicationLogSchema = z.object({
  takenAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});
```

## 🛡️ ミドルウェア

### エラーハンドラー

```typescript
// middleware/error-handler.ts
import { Context, Next } from 'hono';

export const errorHandler = () => {
  return async (c: Context, next: Next) => {
    try {
      await next();
    } catch (error) {
      console.error('Error:', error);
      
      return c.json({
        success: false,
        message: '内部サーバーエラーが発生しました',
        errorCode: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
      }, 500);
    }
  };
};
```

### 認証ミドルウェア（将来実装予定）

```typescript
// middleware/auth.ts
import { Context, Next } from 'hono';

export const authMiddleware = () => {
  return async (c: Context, next: Next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return c.json({
        success: false,
        message: '認証が必要です',
        errorCode: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
      }, 401);
    }
    
    // JWT検証ロジック
    // ...
    
    await next();
  };
};
```

## 🧪 テスト

### テストの実行

```bash
# 全テスト実行
bun test

# カバレッジ付きテスト
bun test --coverage

# 特定のテストファイル実行
bun test auth.test.ts
```

### テスト例

```typescript
// lib/auth.test.ts
import { describe, it, expect } from 'bun:test';
import { validateToken } from './auth';

describe('Auth', () => {
  it('should validate valid token', () => {
    const token = 'valid-token';
    const result = validateToken(token);
    expect(result).toBe(true);
  });

  it('should reject invalid token', () => {
    const token = 'invalid-token';
    const result = validateToken(token);
    expect(result).toBe(false);
  });
});
```

## 🔧 開発ツール

### 利用可能なスクリプト

```bash
# 開発サーバー起動
bun run dev

# 型チェック
bun run typecheck

# リント実行
bun run lint

# テスト実行
bun run test

# カバレッジ付きテスト
bun run test:coverage
```

### Biome設定

```json
// biome.json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

## 🚀 デプロイメント

### Cloudflare Workers設定

```toml
# wrangler.toml
name = "okusuri-backend"
main = "src/app.ts"
compatibility_date = "2024-01-15"

[env.production]
name = "okusuri-backend-prod"

[[d1_databases]]
binding = "DB"
database_name = "okusuri-db"
database_id = "your-database-id"
```

### デプロイコマンド

```bash
# 開発環境デプロイ
wrangler deploy

# 本番環境デプロイ
wrangler deploy --env production
```

## 📊 パフォーマンス

### 最適化のポイント

1. **データベースクエリの最適化**
   - 適切なインデックスの設定
   - N+1問題の回避
   - クエリの最適化

2. **キャッシュ戦略**
   - Cloudflare Workers のキャッシュ機能活用
   - データベースクエリ結果のキャッシュ

3. **レスポンスサイズの最適化**
   - 必要なフィールドのみ返却
   - 圧縮の活用

## 🔒 セキュリティ

### セキュリティ対策

1. **入力値のバリデーション**
   - Zod による型安全なバリデーション
   - SQL インジェクション対策（Drizzle ORM）

2. **CORS設定**
   - 適切なオリジン設定
   - プリフライトリクエストの処理

3. **エラーハンドリング**
   - 機密情報の漏洩防止
   - 適切なエラーメッセージ

## 🔗 関連ドキュメント

- [API仕様書](./api.md)
- [データベース設計](./database.md)
- [セットアップガイド](./setup.md)
- [システム概要](./architecture.md)