FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# 必要なパッケージをインストール（キャッシュ効率化のため順序を最適化）
RUN apt-get update && apt-get install -y \
    curl \
    git \
    zsh \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

# miseをインストール（バージョンを固定してキャッシュ効率化）
ARG MISE_VERSION=v2025.9.24
USER vscode
RUN curl -fsSL "https://mise.jdx.dev/install.sh" | MISE_VERSION=${MISE_VERSION} sh \
    && echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc \
    && echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc

# 作業ディレクトリを設定
WORKDIR /app

# 権限を適切に設定
USER root
RUN chown -R vscode:vscode /app
USER vscode
