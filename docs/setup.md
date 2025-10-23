# セットアップガイド

お薬管理アプリの開発環境を構築するためのガイドです。

## 📋 前提条件

- Node.js 18.0.0以上
- Bun 1.0.0以上
- Git

## 🚀 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd okusuri-monorepo
```

### 2. 依存関係のインストール

```bash
# ルートディレクトリで依存関係をインストール
bun install

# または、miseを使用してセットアップ
bun run setup
```

### 3. 環境変数の設定

#### バックエンド環境変数

`backend/.env` ファイルを作成し、以下の変数を設定：

```env
# データベース設定
DATABASE_URL="your_database_url"

# Cloudflare Workers設定
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_API_TOKEN="your_api_token"

# その他の設定
NODE_ENV="development"
```

#### フロントエンド環境変数

`frontend/.env` ファイルを作成し、以下の変数を設定：

```env
VITE_API_BASE_URL="http://localhost:8787/api"
```

### 4. データベースのセットアップ

```bash
# データベースマイグレーションの実行
cd backend
bun run db:migrate
```

### 5. 開発サーバーの起動

#### 全サービスを同時に起動

```bash
# ルートディレクトリで実行
bun run dev
```

#### 個別に起動

```bash
# バックエンドのみ
bun run backend:dev

# フロントエンドのみ
bun run frontend:dev
```

## 🔧 開発ツール

### 利用可能なスクリプト

#### ルートレベル

```bash
# 開発サーバー起動
bun run dev

# テスト実行
bun run test

# 型チェック
bun run typecheck

# リント実行
bun run lint

# ビルド
bun run build
```

#### バックエンド

```bash
cd backend

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

#### フロントエンド

```bash
cd frontend

# 開発サーバー起動
bun run dev

# ビルド
bun run build

# プレビュー
bun run preview

# 型チェック
bun run typecheck

# リント実行
bun run lint

# リント修正
bun run lint:fix

# テスト実行
bun run test

# カバレッジ付きテスト
bun run test:coverage
```

## 🐛 トラブルシューティング

### よくある問題

#### 1. 依存関係のインストールエラー

```bash
# キャッシュをクリアして再インストール
rm -rf node_modules bun.lockb
bun install
```

#### 2. ポートが既に使用されている

```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :8787

# プロセスを終了
kill -9 <PID>
```

#### 3. 型エラーが発生する

```bash
# 型チェックを実行
bun run typecheck

# 型定義を再生成
cd shared && bun run build
```

### ログの確認

#### バックエンドログ

```bash
# バックエンドのログを確認
cd backend
bun run dev
```

#### フロントエンドログ

ブラウザの開発者ツールのコンソールで確認できます。

## 📁 プロジェクト構造

```
okusuri-monorepo/
├── backend/          # バックエンド（Hono + Cloudflare Workers）
├── frontend/         # フロントエンド（React + Vite）
├── shared/           # 共通ライブラリ
├── docs/             # ドキュメント
└── package.json      # ルートのpackage.json
```

## 🔗 関連リンク

- [アーキテクチャ概要](./architecture.md)
- [API仕様書](./api.md)
- [デプロイメントガイド](./deployment.md)