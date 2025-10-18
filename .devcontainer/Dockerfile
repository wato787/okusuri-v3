# syntax=docker/dockerfile:1.7
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# bun公式インストールスクリプトはmise内で利用するためここでは必要最低限の依存のみ
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git unzip build-essential pkg-config libssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# miseインストール
RUN curl https://mise.jdx.dev/install.sh | sh
ENV PATH="/root/.local/share/mise/bin:${PATH}"

# デフォルトでmiseを有効化
RUN echo 'eval "$(mise activate bash)"' >> /root/.bashrc
RUN echo 'eval "$(mise activate zsh)"' >> /root/.zshrc
