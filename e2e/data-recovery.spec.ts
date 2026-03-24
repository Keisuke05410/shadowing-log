import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { formatLocalDate } from './helpers';

test('データ破損 → エラーバナー → インポートで復旧', async ({ page }) => {
  // localStorage に壊れたデータを入れる
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('shadowing-log-data', 'corrupted{{{data');
  });
  await page.goto('/');

  // エラーバナーが表示される
  await expect(page.getByText('データの読み込みに失敗しました')).toBeVisible();
  await expect(page.getByText('設定画面のインポート機能')).toBeVisible();

  // 設定画面へ
  await page.getByText('設定画面のインポート機能').click();
  await expect(page).toHaveURL(/\/#\/settings/);

  // インポート用JSONファイルを作成
  const today = new Date();
  const validData = {
    materials: [
      {
        id: 'm1',
        name: 'Recovered Material',
        lengthSeconds: 120,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    sessions: [
      {
        id: 's1',
        date: formatLocalDate(today),
        materialId: 'm1',
        durationMinutes: 10,
        selfEvaluation: 4,
        createdAt: today.toISOString(),
      },
    ],
  };

  const tmpFile = path.join('/tmp', 'shadowing-log-test-import.json');
  fs.writeFileSync(tmpFile, JSON.stringify(validData));

  // window.confirm をオーバーライド
  page.on('dialog', (dialog) => dialog.accept());

  // インポート
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(tmpFile);

  // インポート成功トースト
  await expect(page.getByText('データをインポートしました')).toBeVisible();

  // エラーバナーが消えている
  await expect(page.getByText('データの読み込みに失敗しました')).not.toBeVisible();

  // ダッシュボードに戻ると復旧データが反映されている
  await page.getByRole('link', { name: 'ダッシュボード' }).click();
  await expect(page.getByText('済 ✓')).toBeVisible();

  // 後片付け
  fs.unlinkSync(tmpFile);
});
