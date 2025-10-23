#!/bin/bash

# Devcontainer セットアップスクリプト
set -euo pipefail

# ログ関数
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[ERROR] $1" >&2
    exit 1
}

# エラーハンドリング
trap 'error "セットアップ中にエラーが発生しました: 行 $LINENO"' ERR

log "🚀 Devcontainer セットアップを開始します..."

# 必要なディレクトリを作成
mkdir -p ~/.local/bin
mkdir -p ~/.config

# Zsh テーマを変更
log "📝 Zsh テーマを変更中..."
if [ -f ~/.zshrc ]; then
    sed -i 's/ZSH_THEME="devcontainers"/ZSH_THEME="robbyrussell"/' ~/.zshrc
    log "✅ Zsh テーマを変更しました"
else
    log "⚠️  .zshrc が見つかりません"
fi

# mise の初期化コードを .zshrc に追加
log "🔧 mise の初期化コードを追加中..."
if ! grep -q "mise activate zsh" ~/.zshrc; then
    {
        echo ""
        echo "# mise の初期化"
        echo 'eval "$(mise activate zsh)"'
        echo 'export PATH="$HOME/.local/bin:$PATH"'
    } >> ~/.zshrc
    log "✅ mise の初期化コードを .zshrc に追加しました"
else
    log "ℹ️  mise の初期化コードは既に存在します"
fi

# mise のパスを設定
export PATH="$HOME/.local/bin:$PATH"

# mise を信頼してツールをインストール
log "📦 mise ツールをインストール中..."
if command -v mise >/dev/null 2>&1; then
    # mise を信頼
    mise trust || log "⚠️  mise trust で警告が発生しました"
    
    # ツールをインストール（bun など）
    log "📦 必要なツールをインストール中..."
    mise install || error "ツールのインストールに失敗しました"
    
    # パスを再読み込み
    export PATH="$HOME/.local/bin:$PATH"
    
    # bun が利用可能か確認
    if command -v bun >/dev/null 2>&1; then
        log "✅ bun が利用可能です: $(bun --version)"
    else
        error "bun のインストールに失敗しました"
    fi
    
    # 環境変数ファイルを生成
    log "🔧 環境変数ファイルを生成中..."
    if [ -f "scripts/setup-env.js" ]; then
        bun scripts/setup-env.js || log "⚠️  環境変数ファイルの生成で警告が発生しました"
    else
        log "⚠️  scripts/setup-env.js が見つかりません"
    fi
    
    # パッケージをインストール
    log "📦 パッケージをインストール中..."
    bun install || error "パッケージのインストールに失敗しました"
    
    # バックエンドとフロントエンドの依存関係をインストール
    log "📦 バックエンド依存関係をインストール中..."
    cd backend && bun install || error "バックエンド依存関係のインストールに失敗しました"
    cd ..
    
    log "📦 フロントエンド依存関係をインストール中..."
    cd frontend && bun install || error "フロントエンド依存関係のインストールに失敗しました"
    cd ..
    
    # 共有パッケージの依存関係をインストール
    log "📦 共有パッケージ依存関係をインストール中..."
    cd shared && bun install || error "共有パッケージ依存関係のインストールに失敗しました"
    cd ..
    
    log "✅ すべての依存関係のインストールが完了しました"
else
    error "mise が見つかりません。Dockerfile の設定を確認してください。"
fi

# 権限を適切に設定
chmod +x ~/.local/bin/* 2>/dev/null || true

# 環境変数ファイルの最終確認
log "🔍 環境変数ファイルの最終確認中..."
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    log "⚠️  .env ファイルが見つかりません。手動で生成します..."
    bun scripts/setup-env.js || log "⚠️  手動生成で警告が発生しました"
fi

# データベースの準備
log "🗄️  データベースの準備中..."
if command -v psql >/dev/null 2>&1; then
    log "✅ PostgreSQL が利用可能です"
else
    log "⚠️  PostgreSQL が見つかりません（Docker Compose で起動される予定です）"
fi

log "✅ Devcontainer セットアップが完了しました！"
log "💡 新しいターミナルセッションで mise ツール（bun など）が使えるようになります"
log "🚀 開発を開始するには 'mise exec dev' を実行してください"
log "📝 または個別に 'mise exec backend_dev' と 'mise exec frontend_dev' を実行してください"