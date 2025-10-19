FROM mcr.microsoft.com/devcontainers/base:ubuntu

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    curl \
    git \
    zsh \
    && rm -rf /var/lib/apt/lists/*

# miseをインストール
ARG MISE_VERSION=2025.10.7
USER vscode
RUN curl -fsSL "https://mise.jdx.dev/install.sh" | MISE_VERSION=v${MISE_VERSION} sh
USER root

# 作業ディレクトリを設定
WORKDIR /app
