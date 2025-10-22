# テストガイド

お薬管理アプリのテスト戦略と実行方法について説明します。

## 🧪 テスト戦略

### テストピラミッド

```
        E2E Tests (少数)
       /                \
   Integration Tests (中程度)
  /                        \
Unit Tests (多数)
```

### テストの種類

1. **単体テスト (Unit Tests)**
   - 個別の関数・コンポーネントのテスト
   - 高速で頻繁に実行

2. **統合テスト (Integration Tests)**
   - 複数のモジュール間の連携テスト
   - API エンドポイントのテスト

3. **E2Eテスト (End-to-End Tests)**
   - ユーザーの操作フローのテスト
   - 実際のブラウザでの動作確認

## 🔧 テスト環境設定

### 利用技術

- **テストランナー**: Bun Test
- **アサーション**: ビルトインアサーション
- **モック**: Bun のモック機能
- **カバレッジ**: Bun のカバレッジ機能

### テスト設定

```json
// package.json
{
  "scripts": {
    "test": "bun test",
    "test:coverage": "bun test --coverage",
    "test:watch": "bun test --watch"
  }
}
```

## 🧩 単体テスト

### バックエンドの単体テスト

#### ユーティリティ関数のテスト

```typescript
// lib/auth.test.ts
import { describe, it, expect } from 'bun:test';
import { validateToken, generateToken } from './auth';

describe('Auth Utils', () => {
  describe('validateToken', () => {
    it('should validate correct token', () => {
      const token = 'valid-token-123';
      const result = validateToken(token);
      expect(result).toBe(true);
    });

    it('should reject invalid token', () => {
      const token = 'invalid-token';
      const result = validateToken(token);
      expect(result).toBe(false);
    });

    it('should reject empty token', () => {
      const token = '';
      const result = validateToken(token);
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate valid token', () => {
      const userId = 'user-123';
      const token = generateToken(userId);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });
});
```

#### リポジトリのテスト

```typescript
// repositories/medication.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { MedicationRepository } from './medication';
import { db } from '../db';

describe('MedicationRepository', () => {
  let repository: MedicationRepository;

  beforeEach(() => {
    repository = new MedicationRepository();
  });

  describe('create', () => {
    it('should create medication log', async () => {
      const data = {
        medicationId: 'med-123',
        takenAt: '2024-01-15T10:30:00.000Z',
        notes: '朝食後',
      };

      const result = await repository.create(data);
      
      expect(result).toBeDefined();
      expect(result[0].medicationId).toBe(data.medicationId);
      expect(result[0].takenAt).toBe(data.takenAt);
    });
  });

  describe('findById', () => {
    it('should find medication log by id', async () => {
      // テストデータの準備
      const testData = {
        id: 'log-123',
        medicationId: 'med-123',
        takenAt: '2024-01-15T10:30:00.000Z',
        notes: 'テストメモ',
      };
      await repository.create(testData);

      const result = await repository.findById('log-123');
      
      expect(result).toBeDefined();
      expect(result[0].id).toBe('log-123');
    });

    it('should return empty array for non-existent id', async () => {
      const result = await repository.findById('non-existent');
      expect(result).toEqual([]);
    });
  });
});
```

### フロントエンドの単体テスト

#### ユーティリティ関数のテスト

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'bun:test';
import { formatDate, formatTime, cn } from './utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024年1月15日');
    });

    it('should handle different timezones', () => {
      const date = new Date('2024-01-15T00:00:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toBeDefined();
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const formatted = formatTime(date);
      expect(formatted).toBe('19:30');
    });
  });

  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const result = cn('class1', { 'class2': true, 'class3': false });
      expect(result).toBe('class1 class2');
    });
  });
});
```

#### コンポーネントのテスト

```typescript
// components/ui/button.test.tsx
import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('should apply variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button.className).toContain('bg-destructive');
  });

  it('should apply size classes', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByText('Large Button');
    expect(button.className).toContain('h-11');
  });

  it('should handle click events', () => {
    const handleClick = () => {};
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button.onclick).toBeDefined();
  });
});
```

## 🔗 統合テスト

### API エンドポイントのテスト

```typescript
// features/medication/handlers/create.test.ts
import { describe, it, expect, beforeEach } from 'bun:test';
import { createHandler } from './create';
import { Context } from 'hono';

describe('Create Medication Log Handler', () => {
  let mockContext: Context;

  beforeEach(() => {
    mockContext = {
      req: {
        json: async () => ({
          medicationId: 'med-123',
          takenAt: '2024-01-15T10:30:00.000Z',
          notes: '朝食後',
        }),
      },
      json: (data: any) => data,
    } as any;
  });

  it('should create medication log successfully', async () => {
    const result = await createHandler(mockContext);
    
    expect(result.success).toBe(true);
    expect(result.data.medicationId).toBe('med-123');
    expect(result.message).toContain('作成しました');
  });

  it('should handle validation errors', async () => {
    mockContext.req.json = async () => ({
      // 必須フィールドが不足
      notes: '朝食後',
    });

    const result = await createHandler(mockContext);
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('失敗しました');
  });
});
```

### データベース統合テスト

```typescript
// db/integration.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { db } from './index';
import { medicationLogs } from './tables';

describe('Database Integration', () => {
  beforeEach(async () => {
    // テストデータのクリーンアップ
    await db.delete(medicationLogs);
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await db.delete(medicationLogs);
  });

  it('should insert and retrieve medication log', async () => {
    const testData = {
      id: 'log-123',
      medicationId: 'med-123',
      takenAt: '2024-01-15T10:30:00.000Z',
      notes: 'テストメモ',
      createdAt: '2024-01-15T10:30:00.000Z',
    };

    // データの挿入
    await db.insert(medicationLogs).values(testData);

    // データの取得
    const result = await db.select().from(medicationLogs).where(eq(medicationLogs.id, 'log-123'));
    
    expect(result).toHaveLength(1);
    expect(result[0].medicationId).toBe('med-123');
  });
});
```

## 🌐 E2Eテスト

### Playwright を使用したE2Eテスト

```typescript
// e2e/medication-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Medication Management Flow', () => {
  test('should add and view medication log', async ({ page }) => {
    // アプリケーションにアクセス
    await page.goto('http://localhost:3000');

    // 新しい薬を追加
    await page.click('text=新しい薬を追加');
    await page.fill('input[name="name"]', 'アスピリン');
    await page.fill('input[name="dosage"]', '100mg');
    await page.fill('input[name="frequency"]', '朝食後');
    await page.click('button[type="submit"]');

    // 薬が追加されたことを確認
    await expect(page.locator('text=アスピリン')).toBeVisible();

    // 服用ログを記録
    await page.click('text=服用済み');
    await expect(page.locator('text=服用済み')).toBeVisible();
  });

  test('should display medication history', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 履歴ページに移動
    await page.click('text=履歴');

    // 履歴が表示されることを確認
    await expect(page.locator('text=服用履歴')).toBeVisible();
  });
});
```

## 📊 カバレッジ

### カバレッジの実行

```bash
# バックエンドのカバレッジ
cd backend
bun test --coverage

# フロントエンドのカバレッジ
cd frontend
bun test --coverage

# 全体のカバレッジ
bun run test:coverage
```

### カバレッジレポート

```typescript
// カバレッジ設定例
export default {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## 🚀 テスト実行

### 開発中のテスト実行

```bash
# 全テスト実行
bun test

# ウォッチモードでテスト実行
bun test --watch

# 特定のファイルのテスト実行
bun test auth.test.ts

# 特定のディレクトリのテスト実行
bun test src/lib/
```

### CI/CD でのテスト実行

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Run tests
        run: bun test --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 🧪 テストデータ管理

### テストデータの作成

```typescript
// test/fixtures/medication.ts
export const createTestMedication = (overrides = {}) => ({
  id: 'med-123',
  name: 'アスピリン',
  dosage: '100mg',
  frequency: '朝食後',
  startDate: '2024-01-01',
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

export const createTestMedicationLog = (overrides = {}) => ({
  id: 'log-123',
  medicationId: 'med-123',
  takenAt: '2024-01-15T10:30:00.000Z',
  notes: '朝食後',
  createdAt: '2024-01-15T10:30:00.000Z',
  ...overrides,
});
```

### モックの使用

```typescript
// test/mocks/api.ts
export const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

// テストでの使用
beforeEach(() => {
  vi.clearAllMocks();
  mockApiClient.get.mockResolvedValue({ success: true, data: [] });
});
```

## 🔍 デバッグ

### テストのデバッグ

```bash
# デバッグモードでテスト実行
bun test --inspect

# 特定のテストのデバッグ
bun test --inspect auth.test.ts
```

### ログ出力

```typescript
// テストでのログ出力
import { describe, it, expect } from 'bun:test';

describe('Debug Test', () => {
  it('should debug test execution', () => {
    console.log('Test is running...');
    const result = someFunction();
    console.log('Result:', result);
    expect(result).toBeDefined();
  });
});
```

## 📋 ベストプラクティス

### テストの書き方

1. **AAA パターン**
   - Arrange: テストデータの準備
   - Act: テスト対象の実行
   - Assert: 結果の検証

2. **テストの独立性**
   - 各テストは独立して実行可能
   - テスト間でデータを共有しない

3. **説明的なテスト名**
   - 何をテストしているかが明確
   - 期待する結果が分かる

### テストの保守性

1. **DRY原則**
   - 共通のテストデータは関数化
   - 共通のセットアップはbeforeEachで

2. **テストの整理**
   - 関連するテストはdescribeでグループ化
   - テストファイルは機能ごとに分割

## 🔗 関連ドキュメント

- [セットアップガイド](./setup.md)
- [バックエンド開発](./backend.md)
- [フロントエンド開発](./frontend.md)
- [デプロイメントガイド](./deployment.md)