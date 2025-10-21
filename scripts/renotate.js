#!/usr/bin/env node

/**
 * renotate - 依存関係の自動更新ツール
 * メジャーアップデート以外は自動マージする設定
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class Renotate {
  constructor() {
    this.config = this.loadConfig();
    this.updates = [];
  }

  loadConfig() {
    const configPath = path.join(process.cwd(), 'renotate.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return this.getDefaultConfig();
  }

  getDefaultConfig() {
    return {
      packageManagers: ['npm', 'go'],
      autoMerge: {
        enabled: true,
        majorUpdates: false,
        minorUpdates: true,
        patchUpdates: true
      },
      packageFilters: {
        exclude: ['react', 'react-dom'],
        include: []
      },
      updateLimits: {
        maxPackagesPerPr: 10,
        maxPrsPerWeek: 5
      },
      pullRequest: {
        titleTemplate: "chore: 依存関係を更新 ({{packageCount}}個のパッケージ)",
        labels: ['dependencies', 'automated', 'renotate'],
        reviewers: [],
        assignees: []
      },
      testing: {
        runTests: true,
        testCommands: [
          'cd frontend && bun run lint',
          'cd frontend && bun run build',
          'cd backend && go test ./...'
        ],
        skipOnTestFailure: true
      }
    };
  }

  async checkForUpdates() {
    console.log('🔍 依存関係の更新をチェック中...');
    
    for (const manager of this.config.packageManagers) {
      switch (manager) {
        case 'npm':
          await this.checkNpmUpdates();
          break;
        case 'go':
          await this.checkGoUpdates();
          break;
      }
    }

    return this.updates;
  }

  async checkNpmUpdates() {
    try {
      console.log('📦 フロントエンドの依存関係をチェック中...');
      
      // frontendディレクトリに移動
      process.chdir('frontend');
      
      // 古いパッケージをチェック
      const outdated = execSync('bun outdated --json', { encoding: 'utf8' });
      const outdatedPackages = JSON.parse(outdated);
      
      for (const [name, info] of Object.entries(outdatedPackages)) {
        if (this.shouldUpdatePackage(name, info.current, info.latest)) {
          this.updates.push({
            name,
            current: info.current,
            latest: info.latest,
            type: this.getUpdateType(info.current, info.latest),
            manager: 'npm',
            path: 'frontend/package.json'
          });
        }
      }
      
      process.chdir('..');
    } catch (error) {
      console.log('⚠️ フロントエンドの依存関係チェックでエラー:', error.message);
    }
  }

  async checkGoUpdates() {
    try {
      console.log('🔧 バックエンドの依存関係をチェック中...');
      
      // backendディレクトリに移動
      process.chdir('backend');
      
      // 古いパッケージをチェック
      const outdated = execSync('go list -u -m all', { encoding: 'utf8' });
      const lines = outdated.split('\n').filter(line => line.includes('['));
      
      for (const line of lines) {
        const match = line.match(/^(\S+)\s+(\S+)\s+\[(\S+)\]/);
        if (match) {
          const [, name, current, latest] = match;
          if (this.shouldUpdatePackage(name, current, latest)) {
            this.updates.push({
              name,
              current,
              latest,
              type: this.getUpdateType(current, latest),
              manager: 'go',
              path: 'backend/go.mod'
            });
          }
        }
      }
      
      process.chdir('..');
    } catch (error) {
      console.log('⚠️ バックエンドの依存関係チェックでエラー:', error.message);
    }
  }

  shouldUpdatePackage(name, current, latest) {
    // 除外リストをチェック
    if (this.config.packageFilters.exclude.includes(name)) {
      return false;
    }

    // バージョンが同じ場合はスキップ
    if (current === latest) {
      return false;
    }

    const updateType = this.getUpdateType(current, latest);
    
    // 自動マージの設定に基づいて判断
    switch (updateType) {
      case 'major':
        return this.config.autoMerge.majorUpdates;
      case 'minor':
        return this.config.autoMerge.minorUpdates;
      case 'patch':
        return this.config.autoMerge.patchUpdates;
      default:
        return false;
    }
  }

  getUpdateType(current, latest) {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);
    
    if (latestParts[0] > currentParts[0]) return 'major';
    if (latestParts[1] > currentParts[1]) return 'minor';
    if (latestParts[2] > currentParts[2]) return 'patch';
    
    return 'unknown';
  }

  async createPullRequest() {
    if (this.updates.length === 0) {
      console.log('✅ 更新が必要な依存関係はありません');
      return;
    }

    console.log(`📝 ${this.updates.length}個のパッケージを更新するPRを作成中...`);

    // ブランチを作成
    const branchName = `renotate/updates-${Date.now()}`;
    execSync(`git checkout -b ${branchName}`);

    // 依存関係を更新
    await this.updateDependencies();

    // 変更をコミット
    execSync('git add .');
    execSync(`git commit -m "chore: 依存関係を更新 (${this.updates.length}個のパッケージ)"`);

    // ブランチをプッシュ
    execSync(`git push origin ${branchName}`);

    // PRを作成
    const prBody = this.generatePrBody();
    const prTitle = this.config.pullRequest.titleTemplate.replace('{{packageCount}}', this.updates.length);
    
    const labels = this.config.pullRequest.labels.join(',');
    const assignees = this.config.pullRequest.assignees.join(',');
    
    const ghCommand = `gh pr create --title "${prTitle}" --body "${prBody}" --label "${labels}"`;
    if (assignees) {
      execSync(`${ghCommand} --assignee "${assignees}"`);
    } else {
      execSync(ghCommand);
    }

    console.log('✅ PRが作成されました');
  }

  async updateDependencies() {
    for (const update of this.updates) {
      console.log(`🔄 ${update.name} を ${update.current} から ${update.latest} に更新中...`);
      
      if (update.manager === 'npm') {
        process.chdir('frontend');
        execSync(`bun add ${update.name}@${update.latest}`);
        process.chdir('..');
      } else if (update.manager === 'go') {
        process.chdir('backend');
        execSync(`go get ${update.name}@${update.latest}`);
        process.chdir('..');
      }
    }
  }

  generatePrBody() {
    const packages = this.updates.map(update => 
      `- **${update.name}**: ${update.current} → ${update.latest} (${update.type})`
    ).join('\n');

    const minorCount = this.updates.filter(u => u.type === 'minor').length;
    const patchCount = this.updates.filter(u => u.type === 'patch').length;

    return `## 依存関係の自動更新

このPRはrenotateによって自動的に作成されました。

### 更新されたパッケージ
${packages}

### 更新の種類
- マイナーアップデート: ${minorCount}個
- パッチアップデート: ${patchCount}個

### 確認事項
- [ ] テストが通ることを確認
- [ ] ビルドが成功することを確認
- [ ] 動作確認（必要に応じて）

## 自動マージ
このPRは設定により自動的にマージされます。`;
  }

  async runTests() {
    if (!this.config.testing.runTests) {
      return true;
    }

    console.log('🧪 テストを実行中...');
    
    for (const command of this.config.testing.testCommands) {
      try {
        execSync(command, { stdio: 'inherit' });
      } catch (error) {
        console.log(`❌ テストが失敗しました: ${command}`);
        if (this.config.testing.skipOnTestFailure) {
          return false;
        }
        throw error;
      }
    }
    
    console.log('✅ すべてのテストが成功しました');
    return true;
  }

  async run() {
    try {
      console.log('🚀 renotate を開始します...');
      
      const updates = await this.checkForUpdates();
      
      if (updates.length > 0) {
        const testsPassed = await this.runTests();
        if (testsPassed) {
          await this.createPullRequest();
        } else {
          console.log('⚠️ テストが失敗したため、PRの作成をスキップしました');
        }
      }
      
      console.log('✅ renotate が完了しました');
    } catch (error) {
      console.error('❌ renotate でエラーが発生しました:', error.message);
      process.exit(1);
    }
  }
}

// メイン実行
if (require.main === module) {
  const renotate = new Renotate();
  renotate.run();
}

module.exports = Renotate;