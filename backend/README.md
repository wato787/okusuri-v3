# okusuri-backend

## 概要

`okusuri-backend`は、服薬管理アプリケーションのバックエンドAPIサーバーです。Go言語で開発され、服薬記録の管理や通知機能を提供します。

## 開発環境

- Go 1.24
- PostgreSQL
- 起動: `mise backend_dev`
- テスト: `mise backend_test`

開発手順や環境構築はルート`README.md`を参照してください。

## アーキテクチャ

- Echoを用いたRESTful API
- レイヤードアーキテクチャ (handler/service/repository)
- DTOやミドルウェアを活用した責務分離

## ディレクトリ

```
backend/
├── cmd/server/      # エントリーポイント
├── internal/        # ドメインロジック
│   ├── dto/
│   ├── handler/
│   ├── middleware/
│   ├── model/
│   ├── repository/
│   └── service/
├── pkg/             # 設定やユーティリティ
└── migrations/      # DBマイグレーション
```

## 主要機能

- 服薬ログ管理 (服薬記録・出血記録)
- Web Push 通知
- ヘルスチェックAPI

## テスト

```
mise backend_test
```

## データベース

PostgreSQLを利用します。開発時はdevcontainerの`docker-compose.yml`で起動するDBを利用できます。

## 今後のメモ

- 詳細なAPI仕様は今後OpenAPI等で整備予定です。
