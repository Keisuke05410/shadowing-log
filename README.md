# Shadowing Log

英語シャドーイング練習の記録・可視化アプリ。日々の練習を手軽に記録し、継続のモチベーションを維持するための可視化を提供します。

## 機能

- **練習記録** — 教材・練習時間・自己評価・メモを最小ステップで記録
- **ダッシュボード** — ストリーク（連続日数）、今週の合計、GitHub風ヒートマップ
- **履歴** — 日付グループのタイムライン形式で過去の記録を閲覧・削除
- **設定** — 教材の管理、データのエクスポート/インポート（JSON）

## 技術スタック

| 項目 | 選定 |
|------|------|
| フレームワーク | React 19 + TypeScript |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS v4 |
| ルーティング | react-router-dom (HashRouter) |
| ヒートマップ | react-activity-calendar |
| データ保存 | localStorage |
| テスト | Vitest + Playwright |
| Linter/Formatter | ESLint + Prettier |

## セットアップ

```bash
npm install
npm run dev
```

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint` | ESLint + Prettier チェック |
| `npm run format` | Prettier で自動整形 |
| `npm run test` | Vitest 単体テスト実行 |
| `npm run test:e2e` | Playwright E2Eテスト実行（要 `npm run build`） |

## プロジェクト構成

```
src/
├── components/    # UIコンポーネント
├── hooks/         # カスタムフック（AppDataProvider / useAppData）
├── lib/           # ビジネスロジック（storage, streak, heatmap, stats）
├── pages/         # 各画面（Dashboard, Record, History, Settings）
└── types/         # TypeScript型定義
e2e/               # Playwright E2Eテスト
```
