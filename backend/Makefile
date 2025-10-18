# Makefile

.PHONY: dev build run test clean install-deps

# Get Go bin directory path
GO_BIN := $(shell go env GOPATH)/bin

# デフォルトターゲット
all: dev

# 依存関係をインストール
install-deps:
	go mod download

# 開発モードで実行
dev:
	go run ./cmd/server

# ビルド
build:
	go build -o ./bin/server ./cmd/server

# 実行
run: build
	./bin/server

# テスト実行
test:
	go test -v ./...

# クリーンアップ
clean:
	rm -rf ./bin ./tmp
