FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    curl \
    git \
    zsh \
    && rm -rf /var/lib/apt/lists/*

# miseをインストール
ARG MISE_VERSION=v2025.9.24
USER vscode
RUN curl -fsSL "https://mise.jdx.dev/install.sh" | MISE_VERSION=${MISE_VERSION} sh
USER root

# 作業ディレクトリを設定
WORKDIR /app
