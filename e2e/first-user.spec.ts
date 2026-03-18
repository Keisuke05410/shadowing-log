import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
});

test('初回ユーザー: 空のダッシュボード → 教材登録 → 記録 → ダッシュボード', async ({ page }) => {
  // 空のダッシュボード
  await expect(page.getByText('まだ練習記録がありません')).toBeVisible();
  await expect(page.getByText('記録する')).toBeVisible();

  // 記録ボタンをクリック → 記録画面
  await page.getByText('記録する').click();
  await expect(page).toHaveURL(/\/#\/record/);

  // 教材0件メッセージ
  await expect(page.getByText('教材を登録してから記録しましょう')).toBeVisible();

  // 設定画面へ
  await page.getByText('設定画面へ').click();
  await expect(page).toHaveURL(/\/#\/settings/);

  // 教材追加
  await expect(page.getByText('教材を追加しましょう')).toBeVisible();
  await page.getByPlaceholder('例: TED Talk').fill('Test Material');
  await page.locator('input[placeholder="分"]').fill('2');
  await page.locator('input[placeholder="秒"]').fill('30');
  await page.getByRole('button', { name: '登録' }).click();

  // 教材が一覧に表示される
  await expect(page.getByText('Test Material')).toBeVisible();

  // 記録画面へ
  await page.getByRole('link', { name: '記録' }).click();
  await expect(page).toHaveURL(/\/#\/record/);

  // 記録フォームが表示される（教材があるため）
  await expect(page.getByText('練習を記録')).toBeVisible();
  await expect(page.locator('select')).toHaveValue(/.+/);

  // 記録を作成
  await page.getByRole('button', { name: '15分' }).click();
  await page.getByRole('button', { name: '4点' }).click();
  await page.getByRole('button', { name: '記録を保存' }).click();

  // ダッシュボードに遷移
  await expect(page).toHaveURL(/\/#\//);
  // ストリーク or 今日のステータスが見える
  await expect(page.getByText('済 ✓')).toBeVisible();
});
