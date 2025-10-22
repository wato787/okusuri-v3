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
    description: 'ルート環境変数ファイル',
  },
  {
    example: 'frontend/.env.example',
    target: 'frontend/.env',
    description: 'フロントエンド環境変数ファイル',
  },
  {
    example: 'backend/.env.example',
    target: 'backend/.env',
    description: 'バックエンド環境変数ファイル',
  },
];

/**
 * 環境変数ファイルをセットアップする
 * @param {string} examplePath - 例ファイルのパス
 * @param {string} targetPath - ターゲットファイルのパス
 * @param {string} description - ファイルの説明
 * @returns {Promise<boolean>} 成功した場合true
 */
async function setupEnvFile(examplePath, targetPath, description) {
  const fullExamplePath = path.resolve(examplePath);
  const fullTargetPath = path.resolve(targetPath);

  // ターゲットファイルが既に存在する場合はスキップ
  if (fs.existsSync(fullTargetPath)) {
    console.log(`✅ ${description} は既に存在します: ${targetPath}`);
    return true;
  }

  // 例ファイルが存在しない場合はスキップ
  if (!fs.existsSync(fullExamplePath)) {
    console.log(`⚠️  ${description} の例ファイルが見つかりません: ${examplePath}`);
    return false;
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
    return true;
  } catch (error) {
    console.error(`❌ ${description} の作成に失敗しました: ${error.message}`);
    return false;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔧 環境変数ファイルのセットアップを開始します...\n');

  const results = await Promise.all(
    envFiles.map(({ example, target, description }) =>
      setupEnvFile(example, target, description)
    )
  );

  const successCount = results.filter(Boolean).length;
  const totalCount = envFiles.length;

  console.log('\n✨ 環境変数ファイルのセットアップが完了しました！');
  console.log(`📊 成功: ${successCount}/${totalCount} ファイル`);
  console.log('📝 必要に応じて、作成された.envファイルを編集してください。');

  // すべてのファイルが成功した場合のみ正常終了
  if (successCount === totalCount) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// エラーハンドリング
process.on('uncaughtException', (error) => {
  console.error('❌ 予期しないエラーが発生しました:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ 未処理のPromise拒否が発生しました:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ メイン処理でエラーが発生しました:', error.message);
  process.exit(1);
});