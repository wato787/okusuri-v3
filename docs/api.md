# API仕様書

お薬管理アプリのREST APIの詳細仕様について説明します。

## 🌐 基本情報

### ベースURL

```
開発環境: http://localhost:8787/api
本番環境: https://your-domain.com/api
```

### 認証

現在は認証機能は未実装です。将来的にはJWTベースの認証を予定しています。

### レスポンス形式

すべてのAPIレスポンスは以下の形式に従います：

#### 成功レスポンス

```json
{
  "success": true,
  "data": <レスポンスデータ>,
  "message": "操作が正常に完了しました",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### エラーレスポンス

```json
{
  "success": false,
  "message": "エラーメッセージ",
  "errorCode": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### HTTPステータスコード

| コード | 説明 |
|--------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | リクエストエラー |
| 401 | 認証エラー |
| 403 | 認可エラー |
| 404 | リソースが見つからない |
| 500 | サーバーエラー |

## 🏥 ヘルスチェック API

### GET /api/health

アプリケーションの状態を確認します。

#### リクエスト

```http
GET /api/health
```

#### レスポンス

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0.0"
  },
  "message": "サービスは正常に動作しています",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 💊 薬のログ管理 API

### GET /api/medication-log

薬のログ一覧を取得します。

#### リクエスト

```http
GET /api/medication-log?page=1&limit=10&medicationId=med-123
```

#### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|----|
| page | number | いいえ | ページ番号（デフォルト: 1） |
| limit | number | いいえ | 1ページあたりの件数（デフォルト: 10） |
| medicationId | string | いいえ | 薬のIDでフィルタ |

#### レスポンス

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "log-123",
        "medicationId": "med-123",
        "takenAt": "2024-01-15T10:30:00.000Z",
        "notes": "朝食後",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  },
  "message": "薬のログを取得しました",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/medication-log

新しい薬のログを作成します。

#### リクエスト

```http
POST /api/medication-log
Content-Type: application/json

{
  "medicationId": "med-123",
  "takenAt": "2024-01-15T10:30:00.000Z",
  "notes": "朝食後"
}
```

#### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|----|----|----|
| medicationId | string | はい | 薬のID |
| takenAt | string | はい | 服用日時（ISO 8601） |
| notes | string | いいえ | メモ |

#### レスポンス

```json
{
  "success": true,
  "data": {
    "id": "log-123",
    "medicationId": "med-123",
    "takenAt": "2024-01-15T10:30:00.000Z",
    "notes": "朝食後",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "薬のログを作成しました",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/medication-log/:id

特定の薬のログを取得します。

#### リクエスト

```http
GET /api/medication-log/log-123
```

#### レスポンス

```json
{
  "success": true,
  "data": {
    "id": "log-123",
    "medicationId": "med-123",
    "takenAt": "2024-01-15T10:30:00.000Z",
    "notes": "朝食後",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "薬のログを取得しました",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### PUT /api/medication-log/:id

薬のログを更新します。

#### リクエスト

```http
PUT /api/medication-log/log-123
Content-Type: application/json

{
  "takenAt": "2024-01-15T11:00:00.000Z",
  "notes": "朝食後（修正）"
}
```

#### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|----|----|----|
| takenAt | string | いいえ | 服用日時（ISO 8601） |
| notes | string | いいえ | メモ |

#### レスポンス

```json
{
  "success": true,
  "data": {
    "id": "log-123",
    "medicationId": "med-123",
    "takenAt": "2024-01-15T11:00:00.000Z",
    "notes": "朝食後（修正）",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "薬のログを更新しました",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔔 通知管理 API

### GET /api/notification/setting

通知設定を取得します。

#### リクエスト

```http
GET /api/notification/setting?userId=user-123
```

#### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|----|
| userId | string | はい | ユーザーID |

#### レスポンス

```json
{
  "success": true,
  "data": {
    "id": "setting-123",
    "userId": "user-123",
    "medicationId": "med-123",
    "time": "09:00",
    "isEnabled": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "通知設定を取得しました",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/notification/setting

通知設定を登録します。

#### リクエスト

```http
POST /api/notification/setting
Content-Type: application/json

{
  "userId": "user-123",
  "medicationId": "med-123",
  "time": "09:00",
  "isEnabled": true
}
```

#### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|----|----|----|
| userId | string | はい | ユーザーID |
| medicationId | string | はい | 薬のID |
| time | string | はい | 通知時刻（HH:mm形式） |
| isEnabled | boolean | はい | 有効/無効フラグ |

#### レスポンス

```json
{
  "success": true,
  "data": {
    "id": "setting-123",
    "userId": "user-123",
    "medicationId": "med-123",
    "time": "09:00",
    "isEnabled": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "通知設定を登録しました",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/notification/send

通知を送信します。

#### リクエスト

```http
POST /api/notification/send
Content-Type: application/json

{
  "userId": "user-123",
  "message": "お薬の時間です"
}
```

#### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|----|----|----|
| userId | string | はい | ユーザーID |
| message | string | はい | 通知メッセージ |

#### レスポンス

```json
{
  "success": true,
  "data": {
    "notificationId": "notif-123",
    "userId": "user-123",
    "message": "お薬の時間です",
    "sentAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "通知を送信しました",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## ❌ エラーレスポンス

### バリデーションエラー

```json
{
  "success": false,
  "message": "バリデーションエラーが発生しました",
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "details": [
    {
      "field": "medicationId",
      "message": "medicationIdは必須です"
    }
  ]
}
```

### リソースが見つからない

```json
{
  "success": false,
  "message": "指定された薬のログが見つかりません",
  "errorCode": "NOT_FOUND",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### サーバーエラー

```json
{
  "success": false,
  "message": "内部サーバーエラーが発生しました",
  "errorCode": "INTERNAL_SERVER_ERROR",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔗 関連ドキュメント

- [システム概要](./architecture.md)
- [データベース設計](./database.md)
- [バックエンド開発](./backend.md)
- [フロントエンド開発](./frontend.md)