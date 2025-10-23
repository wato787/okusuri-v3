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
 * @returns {{ success: boolean, skipped: boolean, error: boolean }} 処理結果
 */
function setupEnvFile(examplePath, targetPath, description) {
  const fullExamplePath = path.resolve(examplePath);
  const fullTargetPath = path.resolve(targetPath);

  // ターゲットファイルが既に存在する場合はスキップ
  if (fs.existsSync(fullTargetPath)) {
    console.log(`✅ ${description} は既に存在します: ${targetPath}`);
    return { success: true, skipped: true, error: false };
  }

  // 例ファイルが存在しない場合はスキップ
  if (!fs.existsSync(fullExamplePath)) {
    console.log(`⚠️  ${description} の例ファイルが見つかりません: ${examplePath}`);
    return { success: false, skipped: true, error: false };
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
    return { success: true, skipped: false, error: false };
  } catch (error) {
    console.error(`❌ ${description} の作成に失敗しました: ${error.message}`);
    return { success: false, skipped: false, error: true };
  }
}

/**
 * メイン処理
 */
function main() {
  console.log('🔧 環境変数ファイルのセットアップを開始します...\n');

  const results = envFiles.map(({ example, target, description }) =>
    setupEnvFile(example, target, description)
  );

  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => r.error).length;
  const skippedCount = results.filter(r => r.skipped).length;
  const totalCount = envFiles.length;

  console.log('\n✨ 環境変数ファイルのセットアップが完了しました！');
  console.log(`📊 成功: ${successCount}/${totalCount} ファイル`);
  console.log(`📊 スキップ: ${skippedCount} ファイル`);
  console.log('📝 必要に応じて、作成された.envファイルを編集してください。');

  // 実際のエラー（コピー失敗など）がある場合のみ失敗
  if (errorCount > 0) {
    console.log(`❌ ${errorCount} 個のファイルでエラーが発生しました`);
    process.exit(1);
  } else {
    process.exit(0);
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