# コーディング規約

お薬管理アプリのコーディング規約とベストプラクティスについて説明します。

## 📋 基本原則

### コード品質の原則

1. **可読性**: コードは書くよりも読まれる時間の方が長い
2. **保守性**: 将来の変更に耐えられる設計
3. **一貫性**: プロジェクト全体で統一されたスタイル
4. **シンプルさ**: 複雑さを避け、シンプルな解決策を選ぶ

### 設計原則

- **DRY (Don't Repeat Yourself)**: 重複を避ける
- **KISS (Keep It Simple, Stupid)**: シンプルに保つ
- **YAGNI (You Aren't Gonna Need It)**: 必要になるまで実装しない
- **SOLID原則**: オブジェクト指向設計の原則に従う

## 🎨 コードスタイル

### TypeScript 規約

#### 命名規則

```typescript
// 変数・関数: camelCase
const userName = 'john_doe';
const getUserById = (id: string) => {};

// 定数: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// クラス: PascalCase
class MedicationRepository {}

// インターフェース: PascalCase (Iプレフィックスなし)
interface Medication {
  id: string;
  name: string;
}

// 型エイリアス: PascalCase
type MedicationStatus = 'active' | 'inactive' | 'completed';

// 列挙型: PascalCase
enum UserRole {
  Admin = 'admin',
  User = 'user',
}
```

#### インポート順序

```typescript
// 1. Node.js ビルトインモジュール
import { readFile } from 'fs';
import { join } from 'path';

// 2. 外部ライブラリ
import { Hono } from 'hono';
import { z } from 'zod';

// 3. 内部モジュール（絶対パス）
import { MedicationRepository } from '@/repositories/medication';
import { validateToken } from '@/lib/auth';

// 4. 相対パス
import { CreateMedicationSchema } from './schemas';
import { errorHandler } from '../middleware/error-handler';
```

#### 型定義

```typescript
// インターフェースはオブジェクトの形状を定義
interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

// 型エイリアスは複雑な型の組み合わせ
type ApiResponse<T> = {
  success: true;
  data: T;
  message?: string;
} | {
  success: false;
  message: string;
  errorCode?: string;
};

// ジェネリクスの使用
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
}
```

### React 規約

#### コンポーネント定義

```typescript
// 関数コンポーネント（推奨）
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick,
  disabled = false 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

#### フックの使用

```typescript
// カスタムフック
function useMedicationLogs(medicationId: string) {
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/medication-log?medicationId=${medicationId}`);
        setLogs(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [medicationId]);

  return { logs, loading, error };
}
```

### ファイル・ディレクトリ命名

#### ファイル命名

```
// コンポーネント: PascalCase
Button.tsx
MedicationCard.tsx
UserProfile.tsx

// ユーティリティ: camelCase
formatDate.ts
apiClient.ts
validationUtils.ts

// 型定義: camelCase
types.ts
apiTypes.ts
userTypes.ts

// テスト: camelCase.test.ts
button.test.tsx
utils.test.ts
api.test.ts
```

#### ディレクトリ命名

```
// ディレクトリ: kebab-case
medication-log/
user-profile/
api-client/

// または camelCase
medicationLog/
userProfile/
apiClient/
```

## 🏗️ アーキテクチャ規約

### ディレクトリ構造

```
src/
├── components/          # 再利用可能なコンポーネント
│   ├── ui/             # 基本UIコンポーネント
│   ├── forms/          # フォームコンポーネント
│   └── layout/         # レイアウトコンポーネント
├── features/           # 機能別モジュール
│   ├── medication/     # 薬の管理機能
│   └── user/          # ユーザー管理機能
├── lib/               # ライブラリ・ユーティリティ
├── hooks/             # カスタムフック
├── types/             # 型定義
└── utils/             # アプリケーション固有のユーティリティ
```

### モジュール設計

#### 単一責任の原則

```typescript
// ❌ 悪い例: 複数の責任を持つクラス
class MedicationService {
  createMedication(data: CreateMedicationData) { /* ... */ }
  sendNotification(userId: string, message: string) { /* ... */ }
  validateEmail(email: string) { /* ... */ }
}

// ✅ 良い例: 単一責任のクラス
class MedicationService {
  createMedication(data: CreateMedicationData) { /* ... */ }
  updateMedication(id: string, data: UpdateMedicationData) { /* ... */ }
  deleteMedication(id: string) { /* ... */ }
}

class NotificationService {
  sendNotification(userId: string, message: string) { /* ... */ }
}

class ValidationService {
  validateEmail(email: string) { /* ... */ }
}
```

#### 依存性注入

```typescript
// インターフェースの定義
interface IMedicationRepository {
  findById(id: string): Promise<Medication | null>;
  create(data: CreateMedicationData): Promise<Medication>;
}

// 実装
class MedicationRepository implements IMedicationRepository {
  async findById(id: string): Promise<Medication | null> {
    // 実装
  }
  
  async create(data: CreateMedicationData): Promise<Medication> {
    // 実装
  }
}

// サービスクラス
class MedicationService {
  constructor(private repository: IMedicationRepository) {}
  
  async getMedication(id: string): Promise<Medication | null> {
    return this.repository.findById(id);
  }
}
```

## 📝 コメント・ドキュメント

### JSDoc コメント

```typescript
/**
 * 薬の情報を表すインターフェース
 * @interface Medication
 */
interface Medication {
  /** 薬の一意ID */
  id: string;
  /** 薬の名前 */
  name: string;
  /** 用量 */
  dosage: string;
  /** 服用頻度 */
  frequency: string;
  /** 開始日 */
  startDate: string;
  /** 終了日（オプション） */
  endDate?: string;
  /** メモ（オプション） */
  notes?: string;
  /** アクティブ状態 */
  isActive: boolean;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
}

/**
 * 薬のログを作成する
 * @param data - 薬のログデータ
 * @returns 作成された薬のログ
 * @throws {ValidationError} バリデーションエラーが発生した場合
 * @example
 * ```typescript
 * const log = await createMedicationLog({
 *   medicationId: 'med-123',
 *   takenAt: '2024-01-15T10:30:00.000Z',
 *   notes: '朝食後'
 * });
 * ```
 */
async function createMedicationLog(data: CreateMedicationLogData): Promise<MedicationLog> {
  // 実装
}
```

### README コメント

```typescript
/**
 * 薬の管理機能
 * 
 * このモジュールは薬の登録、更新、削除、検索機能を提供します。
 * 
 * @module Medication
 * @author 開発チーム
 * @since 1.0.0
 */

/**
 * 薬のリポジトリクラス
 * 
 * データベースとのやり取りを担当し、薬のCRUD操作を提供します。
 * 
 * @class MedicationRepository
 * @implements {IMedicationRepository}
 */
class MedicationRepository implements IMedicationRepository {
  // 実装
}
```

## 🧪 テスト規約

### テストファイルの構造

```typescript
// medication.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { MedicationService } from './medication';

describe('MedicationService', () => {
  let service: MedicationService;
  let mockRepository: jest.Mocked<IMedicationRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new MedicationService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMedication', () => {
    it('should create medication successfully', async () => {
      // Arrange
      const data = createTestMedicationData();
      mockRepository.create.mockResolvedValue(createTestMedication());

      // Act
      const result = await service.createMedication(data);

      // Assert
      expect(result).toBeDefined();
      expect(mockRepository.create).toHaveBeenCalledWith(data);
    });

    it('should throw error when validation fails', async () => {
      // Arrange
      const invalidData = { name: '' };

      // Act & Assert
      await expect(service.createMedication(invalidData))
        .rejects
        .toThrow('Validation failed');
    });
  });
});
```

### テストデータの管理

```typescript
// test/fixtures/medication.ts
export const createTestMedication = (overrides: Partial<Medication> = {}): Medication => ({
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

export const createTestMedicationData = (overrides: Partial<CreateMedicationData> = {}): CreateMedicationData => ({
  name: 'アスピリン',
  dosage: '100mg',
  frequency: '朝食後',
  startDate: '2024-01-01',
  ...overrides,
});
```

## 🔧 ツール設定

### Biome 設定

```json
// biome.json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "error"
      },
      "correctness": {
        "noUnusedVariables": "error"
      },
      "style": {
        "useConst": "error",
        "noVar": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always"
    }
  }
}
```

### TypeScript 設定

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 📋 コードレビュー

### レビューチェックリスト

#### 機能面
- [ ] 要件を満たしているか
- [ ] エラーハンドリングが適切か
- [ ] エッジケースを考慮しているか
- [ ] パフォーマンスに問題がないか

#### コード品質
- [ ] 命名が適切か
- [ ] 関数・クラスが適切なサイズか
- [ ] 重複コードがないか
- [ ] コメントが適切か

#### テスト
- [ ] テストが書かれているか
- [ ] テストケースが十分か
- [ ] テストが独立しているか

### プルリクエストテンプレート

```markdown
## 変更内容
- 薬のログ機能を追加

## 変更理由
- ユーザーが薬の服用履歴を確認できるようにするため

## テスト
- [ ] 単体テストを追加
- [ ] 統合テストを追加
- [ ] 手動テストを実施

## チェックリスト
- [ ] コードレビューを依頼
- [ ] ドキュメントを更新
- [ ] 破壊的変更がないことを確認
```

## 🔗 関連ドキュメント

- [セットアップガイド](./setup.md)
- [テストガイド](./testing.md)
- [バックエンド開発](./backend.md)
- [フロントエンド開発](./frontend.md)