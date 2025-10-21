# Okusuri Backend (Hono)

服薬管理アプリケーションのバックエンドAPI（Hono + Bun + Drizzle）

## 技術スタック

- **フレームワーク**: Hono
- **ランタイム**: Bun
- **データベース**: SQLite (Drizzle ORM)
- **バリデーション**: Zod

## ディレクトリ構成

```
src/
├── app.ts                 # アプリケーションエントリーポイント
├── types.ts              # 共通型定義
├── context/              # コンテキスト管理
│   ├── bindings.ts       # 型定義
│   └── helpers.ts        # コンテキストヘルパー
├── features/             # 機能別モジュール
│   ├── health/           # ヘルスチェック
│   ├── medication/       # 服薬ログ管理
│   │   ├── handlers/     # 各エンドポイントのハンドラー
│   │   ├── schemas/      # バリデーションスキーマ
│   │   └── router.ts     # ルート定義
│   └── notification/     # 通知機能
├── repositories/         # データアクセス層
├── middleware/           # ミドルウェア
├── lib/                  # ユーティリティ
└── db/                   # データベース関連
    └── schema.ts         # Drizzleスキーマ
```

## 開発環境セットアップ

### 前提条件

- Bun 1.3.0+

### セットアップ

1. 依存関係のインストール
```bash
bun install
```

### 開発サーバー起動

```bash
bun run dev
```

## API エンドポイント

### ヘルスチェック
- `GET /api/health` - サービス状態確認

### 服薬ログ
- `POST /api/medication-log` - 服薬ログ登録
- `GET /api/medication-log` - 服薬ログ一覧取得
- `GET /api/medication-log/:id` - 特定ログ取得
- `PATCH /api/medication-log/:id` - ログ更新

### 通知
- `POST /api/notification` - 通知送信
- `GET /api/notification/setting` - 通知設定取得
- `POST /api/notification/setting` - 通知設定登録
