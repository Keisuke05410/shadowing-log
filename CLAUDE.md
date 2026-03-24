# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

English shadowing practice tracker — React SPA with localStorage persistence.

## Stack
- React 19 + TypeScript + Vite + Tailwind CSS v4
- State: React Context + localStorage (no backend)
- Testing: Vitest (unit), Playwright (E2E)

## Commands
- `npm run dev` — dev server
- `npm run build` — type-check + production build (`tsc -b && vite build`)
- `npm run test` — Vitest unit tests
- `npm run test:e2e` — Playwright E2E tests (requires `npm run build` first; runs against preview server)
- `npm run lint` — ESLint + Prettier check
- `npm run format` — Prettier auto-format
- Commit style: Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.)

## Development Rules
- TypeScript LSP (`typescript-language-server`) を使って型エラーを確認すること
- フロントエンドのUI/デザイン修正には `/frontend-design` スキルを使うこと

## Style Conventions
- Design theme: "Warm Minimal" — CSS custom properties in `src/index.css` (--accent, --text, --border, etc.)
- Colors applied via inline `style={{ color: 'var(--text)' }}` since Tailwind v4 has no custom theme config
- Shared CSS classes: `.card`, `.card-hover`, `.font-heading`, `.animate-fade-in-up`, `.stagger-children`
- Fonts: Outfit (headings/numbers), Noto Sans JP (body) — loaded via Google Fonts in index.html
- Buttons: `rounded-full` for primary actions, `rounded-lg` for secondary
- Japanese UI text throughout

## Structure
- `src/components/` — reusable UI components (10 files)
- `src/pages/` — route pages: Dashboard, Record, History, Settings
- `src/hooks/` — AppDataProvider context for global state
- `src/lib/` — pure logic (stats, streak, heatmap, storage, messages)
- `e2e/` — Playwright E2E tests
