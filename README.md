# okusuri-v3

このリポジトリは服薬管理アプリケーションのモノレポ構成です。Bun + Hono製バックエンドとReact + Viteフロントエンドを一つのリポジトリで管理し、開発環境はdevcontainerとmiseで統一しています。

## リポジトリ構成

```
.
├── backend/   # Bun + Hono 製APIサーバー
├── frontend/  # React + Vite フロントエンド
├── shared/    # 共通型定義とユーティリティ
├── .devcontainer/  # VS Code Dev Container 設定
└── mise.toml  # ツールおよびタスク定義
```

## 開発環境セットアップ

### 前提
- VS Code + Dev Containers 拡張機能
- Docker Desktop

### Dev Containerでの利用
1. VS Codeでこのリポジトリを開く
2. `Dev Containers: Reopen in Container` を実行
3. コンテナ起動時に自動的に以下が実行されます：
   - mise ツールのインストール
   - bun のインストール
   - 全パッケージの依存関係インストール
   - 環境変数ファイルの自動生成
   - PostgreSQL データベースの起動

4. 起動完了後、開発を開始するには：

```bash
# バックエンドとフロントエンドを同時起動
mise exec dev

# または個別に起動
mise exec backend_dev  # バックエンドのみ
mise exec frontend_dev # フロントエンドのみ
```

### Dev Containerを使わない場合
必要なツール（bun）を手動で用意し、次を実行してください。

```bash
mise install
mise exec setup
```

## 主要タスク

| コマンド | 内容 |
| --- | --- |
| `mise exec backend_dev` | バックエンド開発サーバー起動 |
| `mise exec frontend_dev` | フロントエンド開発サーバー起動 |
| `mise exec dev` | バックエンドとフロントエンドを並列起動 |
| `mise exec backend_test` | バックエンドのテストを実行 |
| `mise exec frontend_build` | フロントエンドのビルド |
| `mise exec setup` | 初期セットアップ（依存関係インストール等） |

> ルートの `package.json` からも `bun run dev` 等で同等タスクを実行できます。

## バックエンド
- フレームワーク: Hono + Bun
- データベース: PostgreSQL (devcontainerのdocker-composeで起動)
- 主要コマンド: `mise exec backend_dev`, `mise exec backend_test`, `mise exec backend_lint`

## フロントエンド
- React + Vite + TypeScript
- 開発: `mise exec frontend_dev`
- ビルド: `mise exec frontend_build`
- Lint: `mise exec frontend_lint`

## Bun利用について
- `frontend/` は bun をデフォルトのランナーとして使用します。
- bun 設定は `frontend/bunfig.toml` を参照してください。

## テストとカバレッジ

### テスト実行
```bash
# 全テスト実行
bun run test

# バックエンドのみ
bun run test:backend

# フロントエンドのみ
bun run test:frontend

# カバレッジ付きテスト
bun run test:coverage
```

### Codecov統合
- プルリクエストやプッシュ時に自動的にカバレッジレポートがCodecovに送信されます
- カバレッジ設定は `codecov.yml` で管理されています
- 目標カバレッジ: 80%

#### セットアップ手順
1. [codecov.io](https://codecov.io) でアカウントを作成し、このリポジトリを連携
2. Codecovダッシュボードでリポジトリのトークンを取得
3. GitHubリポジトリの Settings > Secrets and variables > Actions で以下を設定：
   - `CODECOV_TOKEN`: Codecovから取得したトークン

## 環境変数
- 環境変数ファイルは自動生成されます（`.env.example` から `.env` にコピー）
- 必要に応じて生成された `.env` ファイルを編集してください
- データベース接続情報は devcontainer で自動設定されます

## その他
- PostgreSQL は devcontainer の `docker-compose.yml` で立ち上がります
- ポート設定: フロントエンド(5173), バックエンド(3000), データベース(5432)
- 追加のタスクや運用スクリプトは `mise.toml` を更新する方針です
