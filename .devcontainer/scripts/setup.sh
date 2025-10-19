#!/bin/bash

# Devcontainer セットアップスクリプト
set -e

echo "🚀 Devcontainer セットアップを開始します..."

# Zsh テーマを変更
echo "📝 Zsh テーマを変更中..."
sed -i 's/ZSH_THEME="devcontainers"/ZSH_THEME="robbyrussell"/' ~/.zshrc

# mise の初期化コードを .zshrc に追加
echo "🔧 mise の初期化コードを追加中..."
if ! grep -q "mise activate zsh" ~/.zshrc; then
    echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
    echo "✅ mise の初期化コードを .zshrc に追加しました"
else
    echo "ℹ️  mise の初期化コードは既に存在します"
fi

# mise を信頼してツールをインストール
echo "📦 mise ツールをインストール中..."
mise trust
mise install

echo "✅ Devcontainer セットアップが完了しました！"
echo "💡 新しいターミナルセッションで mise ツール（bun など）が使えるようになります"