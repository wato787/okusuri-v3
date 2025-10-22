# データベース設計

お薬管理アプリのデータベーススキーマとテーブル設計について説明します。

## 📊 データベース概要

### 使用技術

- **ORM**: Drizzle ORM
- **データベース**: Cloudflare D1（SQLite互換）
- **マイグレーション**: Drizzle マイグレーション

### 設計原則

1. **正規化**: データの重複を避け、整合性を保つ
2. **パフォーマンス**: 適切なインデックスを設定
3. **拡張性**: 将来の機能追加に対応できる柔軟な設計
4. **データ整合性**: 外部キー制約による整合性保証

## 🗃️ テーブル設計

### 1. users テーブル

ユーザー情報を管理するテーブルです。

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

#### カラム詳細

| カラム名 | 型 | 制約 | 説明 |
|---------|----|----|----|
| id | TEXT | PRIMARY KEY | ユーザーID（UUID） |
| email | TEXT | UNIQUE, NOT NULL | メールアドレス |
| name | TEXT | - | ユーザー名（オプション） |
| created_at | TEXT | NOT NULL | 作成日時（ISO 8601） |
| updated_at | TEXT | NOT NULL | 更新日時（ISO 8601） |

#### インデックス

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2. medication_logs テーブル

薬の服用ログを管理するテーブルです。

```sql
CREATE TABLE medication_logs (
  id TEXT PRIMARY KEY,
  medication_id TEXT NOT NULL,
  taken_at TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL
);
```

#### カラム詳細

| カラム名 | 型 | 制約 | 説明 |
|---------|----|----|----|
| id | TEXT | PRIMARY KEY | ログID（UUID） |
| medication_id | TEXT | NOT NULL | 薬のID |
| taken_at | TEXT | NOT NULL | 服用日時（ISO 8601） |
| notes | TEXT | - | メモ（オプション） |
| created_at | TEXT | NOT NULL | 作成日時（ISO 8601） |

#### インデックス

```sql
CREATE INDEX idx_medication_logs_medication_id ON medication_logs(medication_id);
CREATE INDEX idx_medication_logs_taken_at ON medication_logs(taken_at);
CREATE INDEX idx_medication_logs_created_at ON medication_logs(created_at);
```

### 3. notification_settings テーブル

通知設定を管理するテーブルです。

```sql
CREATE TABLE notification_settings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  medication_id TEXT NOT NULL,
  time TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

#### カラム詳細

| カラム名 | 型 | 制約 | 説明 |
|---------|----|----|----|
| id | TEXT | PRIMARY KEY | 設定ID（UUID） |
| user_id | TEXT | NOT NULL | ユーザーID |
| medication_id | TEXT | NOT NULL | 薬のID |
| time | TEXT | NOT NULL | 通知時刻（HH:mm形式） |
| is_enabled | BOOLEAN | NOT NULL | 有効/無効フラグ |
| created_at | TEXT | NOT NULL | 作成日時（ISO 8601） |
| updated_at | TEXT | NOT NULL | 更新日時（ISO 8601） |

#### インデックス

```sql
CREATE INDEX idx_notification_settings_user_id ON notification_settings(user_id);
CREATE INDEX idx_notification_settings_medication_id ON notification_settings(medication_id);
CREATE INDEX idx_notification_settings_time ON notification_settings(time);
```

## 🔗 リレーションシップ

### エンティティ関係図

```
User (1) ──→ (N) MedicationLog
User (1) ──→ (N) NotificationSetting
Medication (1) ──→ (N) MedicationLog
Medication (1) ──→ (N) NotificationSetting
```

### 外部キー制約

```sql
-- medication_logs テーブル
ALTER TABLE medication_logs 
ADD CONSTRAINT fk_medication_logs_medication_id 
FOREIGN KEY (medication_id) REFERENCES medications(id);

-- notification_settings テーブル
ALTER TABLE notification_settings 
ADD CONSTRAINT fk_notification_settings_user_id 
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE notification_settings 
ADD CONSTRAINT fk_notification_settings_medication_id 
FOREIGN KEY (medication_id) REFERENCES medications(id);
```

## 📈 パフォーマンス最適化

### クエリ最適化

#### 1. 複合インデックス

```sql
-- ユーザー別の薬のログを日付順で取得
CREATE INDEX idx_medication_logs_user_taken_at 
ON medication_logs(user_id, taken_at DESC);

-- 通知設定の有効な設定を取得
CREATE INDEX idx_notification_settings_enabled_time 
ON notification_settings(is_enabled, time) 
WHERE is_enabled = 1;
```

#### 2. パーティショニング

将来的にデータ量が増加した場合のパーティショニング戦略：

```sql
-- 日付ベースのパーティショニング（例）
CREATE TABLE medication_logs_2024_01 
PARTITION OF medication_logs 
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### クエリパターン

#### よく使用されるクエリ

1. **ユーザーの薬のログ取得**
```sql
SELECT * FROM medication_logs 
WHERE user_id = ? 
ORDER BY taken_at DESC 
LIMIT ? OFFSET ?;
```

2. **今日の服用状況確認**
```sql
SELECT * FROM medication_logs 
WHERE user_id = ? 
AND DATE(taken_at) = DATE('now');
```

3. **通知設定の取得**
```sql
SELECT * FROM notification_settings 
WHERE user_id = ? 
AND is_enabled = 1;
```

## 🔒 データ整合性

### 制約

1. **NOT NULL制約**: 必須フィールドの保護
2. **UNIQUE制約**: 一意性の保証
3. **CHECK制約**: データの妥当性検証
4. **外部キー制約**: 参照整合性の保証

### バリデーション

```sql
-- メールアドレスの形式チェック
ALTER TABLE users 
ADD CONSTRAINT chk_email_format 
CHECK (email LIKE '%@%.%');

-- 時刻形式のチェック
ALTER TABLE notification_settings 
ADD CONSTRAINT chk_time_format 
CHECK (time LIKE '__:__');
```

## 📊 データ型

### 使用するデータ型

| 型 | 用途 | 例 |
|----|----|----|
| TEXT | 文字列（ID、メール、名前など） | "user-123", "john@example.com" |
| BOOLEAN | 真偽値 | 1 (true), 0 (false) |
| INTEGER | 数値 | 1, 2, 3 |
| REAL | 浮動小数点数 | 1.5, 2.7 |

### 日時フォーマット

すべての日時は ISO 8601 形式（UTC）で保存：

```typescript
// 例: "2024-01-15T10:30:00.000Z"
const timestamp = new Date().toISOString();
```

## 🔄 マイグレーション

### マイグレーション管理

```bash
# マイグレーション生成
bun run db:generate

# マイグレーション実行
bun run db:migrate

# マイグレーションロールバック
bun run db:rollback
```

### マイグレーションファイル例

```typescript
// 20240115_create_users_table.ts
import { sql } from 'drizzle-orm';

export const up = sql`
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export const down = sql`
  DROP TABLE users;
`;
```

## 🔗 関連ドキュメント

- [API仕様書](./api.md)
- [バックエンド開発](./backend.md)
- [セットアップガイド](./setup.md)