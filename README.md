# okusuri-v3

このリポジトリは服薬管理アプリケーションのモノレポ構成です。Go製バックエンドとNext.jsフロントエンドを一つのリポジトリで管理し、開発環境はdevcontainerとmiseで統一しています。

## リポジトリ構成

```
.
├── backend/   # Go (Gin) 製APIサーバー
├── frontend/  # Next.js (App Router) フロントエンド
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
3. 起動後、ターミナルで以下を実行し依存関係をセットアップ

```bash
mise run setup
```

### Dev Containerを使わない場合
必要なツール（Go 1.24, bun）を手動で用意し、次を実行してください。

```bash
mise install
mise run setup
```

## 主要タスク

| コマンド | 内容 |
| --- | --- |
| `bun run dev:backend` | バックエンド開発サーバー起動 |
| `bun run dev:frontend` | フロントエンド開発サーバー起動 |
| `bun run dev` | バックエンドとフロントエンドを同時起動 |
| `mise run test` | バックエンドのGoテストを実行 |

※ `bun run dev:*` はルートの `package.json` で定義されています。

## バックエンド
- フレームワーク: Gin
- データベース: PostgreSQL (devcontainerのdocker-composeで起動)
- 重要コマンド: `mise run backend_dev`, `mise run backend_test`

## フロントエンド
- React + Vite
- 開発: `mise run frontend_dev`
- ビルド: `mise run frontend_build`
- Lint: `mise run frontend_lint`

## Bun移行について
- `frontend/`はbunをデフォルトのランナーとして使用します。
- `pnpm-lock.yaml`など不要となった依存管理ファイルは削除しました。
- bun設定は`frontend/bunfig.toml`で行います。

## その他
- PostgreSQLはdevcontainerの`docker-compose.yml`で立ち上がります。ローカル起動する場合は同等の環境変数 (ユーザー/パスワード/DB名いずれも`okusuri`) を設定してください。
- 追加のタスクや運用スクリプトは`mise.toml`に追記していく想定です。
