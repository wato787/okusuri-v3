#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 環境変数ファイルをセットアップするスクリプト
 * 既存の.envファイルが存在しない場合のみ、.env.exampleからコピーして作成します
 */

const envFiles = [
  {
    example: '.env.example',
    target: '.env',
    description: 'ルート環境変数ファイル'
  },
  {
    example: 'frontend/.env.example',
    target: 'frontend/.env',
    description: 'フロントエンド環境変数ファイル'
  },
  {
    example: 'backend/.env.example',
    target: 'backend/.env',
    description: 'バックエンド環境変数ファイル'
  }
];

function setupEnvFile(examplePath, targetPath, description) {
  const fullExamplePath = path.resolve(examplePath);
  const fullTargetPath = path.resolve(targetPath);

  // ターゲットファイルが既に存在する場合はスキップ
  if (fs.existsSync(fullTargetPath)) {
    console.log(`✅ ${description} は既に存在します: ${targetPath}`);
    return;
  }

  // 例ファイルが存在しない場合はスキップ
  if (!fs.existsSync(fullExamplePath)) {
    console.log(`⚠️  ${description} の例ファイルが見つかりません: ${examplePath}`);
    return;
  }

  try {
    // ディレクトリが存在しない場合は作成
    const targetDir = path.dirname(fullTargetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 例ファイルをコピー
    fs.copyFileSync(fullExamplePath, fullTargetPath);
    console.log(`✅ ${description} を作成しました: ${targetPath}`);
  } catch (error) {
    console.error(`❌ ${description} の作成に失敗しました: ${error.message}`);
  }
}

function main() {
  console.log('🔧 環境変数ファイルのセットアップを開始します...\n');

  envFiles.forEach(({ example, target, description }) => {
    setupEnvFile(example, target, description);
  });

  console.log('\n✨ 環境変数ファイルのセットアップが完了しました！');
  console.log('📝 必要に応じて、作成された.envファイルを編集してください。');
}

main();