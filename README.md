# okusuri-v3

このリポジトリは服薬管理アプリケーションのモノレポ構成です。Go製バックエンドとNext.jsフロントエンドを一つのリポジトリで管理し、開発環境はdevcontainerとmiseで統一しています。

## リポジトリ構成

```
.
├── backend/   # Go (Echo) 製APIサーバー
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
mise setup
```

### Dev Containerを使わない場合
必要なツール（Go 1.24, bun）を手動で用意し、次を実行してください。

```bash
mise install
mise setup
```

## 主要タスク

| コマンド | 内容 |
| --- | --- |
| `mise backend_dev` | バックエンド開発サーバー起動 |
| `mise frontend_dev` | フロントエンド開発サーバー起動 |
| `mise dev` | バックエンドとフロントエンドを並列起動 |
| `mise backend_test` | バックエンドのGoテストを実行 |
| `mise frontend_build` | フロントエンドのビルド |

> ルートの `package.json` からも `npm run dev` 等で同等タスクを実行できます。

## バックエンド
- フレームワーク: Echo
- データベース: PostgreSQL (devcontainerのdocker-composeで起動)
- 主要コマンド: `mise backend_dev`, `mise backend_test`, `mise backend_fmt`

## フロントエンド
- Next.js 15 / React 19
- 開発: `mise frontend_dev`
- ビルド: `mise frontend_build`
- Lint: `mise frontend_lint`

## Bun利用について
- `frontend/` は bun をデフォルトのランナーとして使用します。
- bun 設定は `frontend/bunfig.toml` を参照してください。

## その他
- PostgreSQL は devcontainer の `docker-compose.yml` で立ち上がります。ローカル起動する場合は同等の環境変数 (ユーザー/パスワード/DB名いずれも `okusuri`) を設定してください。
- 追加のタスクや運用スクリプトは `mise.toml` を更新する方針です。
