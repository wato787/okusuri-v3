# フロントエンド開発

お薬管理アプリのフロントエンド開発について説明します。

## 🎨 技術スタック

### コア技術

- **フレームワーク**: React 19
- **ビルドツール**: Vite
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: Radix UI

### 追加ライブラリ

- **アニメーション**: Framer Motion
- **アイコン**: Lucide React
- **通知**: React Hot Toast
- **ユーティリティ**: clsx, tailwind-merge
- **日付処理**: date-fns

## 📁 ディレクトリ構造

```
frontend/
├── src/
│   ├── App.tsx              # アプリケーションエントリーポイント
│   ├── main.tsx             # アプリケーション初期化
│   ├── components/          # 再利用可能なコンポーネント
│   │   ├── layout/          # レイアウトコンポーネント
│   │   │   ├── Header.tsx
│   │   │   └── HamburgerMenu.tsx
│   │   ├── navigation/      # ナビゲーションコンポーネント
│   │   │   └── BottomNavigation.tsx
│   │   └── ui/              # UI コンポーネント
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── views/               # ページコンポーネント
│   │   └── home/
│   │       ├── Home.tsx
│   │       └── index.ts
│   ├── lib/                 # ライブラリ・ユーティリティ
│   │   ├── utils.ts
│   │   └── utils.test.ts
│   ├── styles/              # スタイルファイル
│   │   └── globals.css
│   └── utils/               # アプリケーション固有のユーティリティ
│       └── apiBase.ts
├── public/                  # 静的ファイル
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 🚀 アプリケーション設定

### エントリーポイント (main.tsx)

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### アプリケーションコンポーネント (App.tsx)

```typescript
import { Home } from "@/views/home";
import "@/styles/globals.css";

export function App() {
  return <Home />;
}

export default App;
```

## 🎨 スタイリング

### Tailwind CSS設定

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### グローバルスタイル

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors;
  }
}
```

## 🧩 コンポーネント設計

### UI コンポーネント

#### Button コンポーネント

```typescript
// components/ui/button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

#### Card コンポーネント

```typescript
// components/ui/card.tsx
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
```

### レイアウトコンポーネント

#### Header コンポーネント

```typescript
// components/layout/Header.tsx
import { HamburgerMenu } from './HamburgerMenu';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              お薬管理アプリ
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <HamburgerMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
```

#### BottomNavigation コンポーネント

```typescript
// components/navigation/BottomNavigation.tsx
import { Home, Plus, Settings, History } from 'lucide-react';

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="grid grid-cols-4 h-16">
        <button className="flex flex-col items-center justify-center space-y-1 text-primary-500">
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">ホーム</span>
        </button>
        <button className="flex flex-col items-center justify-center space-y-1 text-gray-500">
          <Plus className="h-5 w-5" />
          <span className="text-xs font-medium">追加</span>
        </button>
        <button className="flex flex-col items-center justify-center space-y-1 text-gray-500">
          <History className="h-5 w-5" />
          <span className="text-xs font-medium">履歴</span>
        </button>
        <button className="flex flex-col items-center justify-center space-y-1 text-gray-500">
          <Settings className="h-5 w-5" />
          <span className="text-xs font-medium">設定</span>
        </button>
      </div>
    </nav>
  );
}
```

## 📱 ページコンポーネント

### Home ページ

```typescript
// views/home/Home.tsx
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              今日のお薬
            </h2>
            <p className="text-gray-600">
              2024年1月15日（月）
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>アスピリン</span>
                  <span className="text-sm text-gray-500">朝食後</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  100mg × 1錠
                </p>
                <Button className="w-full">
                  服用済み
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ビタミンD</span>
                  <span className="text-sm text-gray-500">夕食後</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  1000IU × 1錠
                </p>
                <Button variant="outline" className="w-full">
                  まだ服用していません
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Button className="w-full" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              新しい薬を追加
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
```

## 🔧 ユーティリティ

### ユーティリティ関数

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
```

### API クライアント

```typescript
// utils/apiBase.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787/api';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

## 🧪 テスト

### テストの実行

```bash
# 全テスト実行
bun test

# カバレッジ付きテスト
bun test --coverage

# 特定のテストファイル実行
bun test utils.test.ts
```

### テスト例

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'bun:test';
import { formatDate, formatTime } from './utils';

describe('Utils', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15T10:30:00.000Z');
    const formatted = formatDate(date);
    expect(formatted).toContain('2024年1月15日');
  });

  it('should format time correctly', () => {
    const date = new Date('2024-01-15T10:30:00.000Z');
    const formatted = formatTime(date);
    expect(formatted).toBe('19:30');
  });
});
```

## 🚀 ビルド・デプロイ

### ビルド設定

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### 利用可能なスクリプト

```bash
# 開発サーバー起動
bun run dev

# ビルド
bun run build

# プレビュー
bun run preview

# 型チェック
bun run typecheck

# リント実行
bun run lint

# リント修正
bun run lint:fix

# テスト実行
bun test

# カバレッジ付きテスト
bun test --coverage
```

## 📱 レスポンシブデザイン

### ブレークポイント

```typescript
// Tailwind CSS のブレークポイント
const breakpoints = {
  sm: '640px',   // スマートフォン
  md: '768px',   // タブレット
  lg: '1024px',  // デスクトップ
  xl: '1280px',  // 大画面デスクトップ
};
```

### レスポンシブコンポーネント例

```typescript
// レスポンシブなグリッドレイアウト
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* カードコンテンツ */}
</div>

// レスポンシブなテキストサイズ
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  タイトル
</h1>
```

## 🎨 アニメーション

### Framer Motion の使用例

```typescript
import { motion } from 'framer-motion';

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold">アニメーション付きカード</h3>
    </motion.div>
  );
}
```

## 🔗 関連ドキュメント

- [API仕様書](./api.md)
- [セットアップガイド](./setup.md)
- [システム概要](./architecture.md)
- [バックエンド開発](./backend.md)