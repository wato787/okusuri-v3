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

    # 通常の mise install
    log "📦 その他のツールをインストール中..."
    mise install --yes || error "ツールのインストールに失敗しました"

    # パスを再読み込み
    export PATH="$HOME/.local/bin:$PATH"

else
    error "mise が見つかりません。Dockerfile の設定を確認してください。"
fi

# 権限を適切に設定
chmod +x ~/.local/bin/* 2>/dev/null || true


log "✅ Devcontainer セットアップが完了しました！"
log "💡 新しいターミナルセッションで mise ツール（bun など）が使えるようになります"
log "🚀 開発を開始するには 'mise dev' を実行してください"
log "📝 または個別に 'mise backend_dev' と 'mise frontend_dev' を実行してください"
