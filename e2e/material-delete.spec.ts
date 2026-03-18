import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Seed: 1 material, 1 session
  await page.evaluate(() => {
    const data = {
      materials: [
        {
          id: 'm1',
          name: 'Only Material',
          lengthSeconds: 180,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      sessions: [
        {
          id: 's1',
          date: '2026-03-15',
          materialId: 'm1',
          durationMinutes: 10,
          selfEvaluation: 3,
          createdAt: '2026-03-15T10:00:00.000Z',
        },
      ],
    };
    localStorage.setItem('shadowing-log-data', JSON.stringify(data));
  });
  await page.goto('/');
});

test('教材全削除 → 記録画面 → 教材0件メッセージ', async ({ page }) => {
  // 設定画面へ
  await page.getByRole('link', { name: '設定' }).click();
  await expect(page).toHaveURL(/\/#\/settings/);

  // 教材が表示されている
  await expect(page.getByText('Only Material')).toBeVisible();

  // 削除（window.confirm をオーバーライド）
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '削除' }).click();

  // 教材0件 → 追加フォーム表示
  await expect(page.getByText('教材を追加しましょう')).toBeVisible();

  // 記録画面へ
  await page.getByRole('link', { name: '記録' }).click();
  await expect(page).toHaveURL(/\/#\/record/);

  // 教材0件メッセージ
  await expect(page.getByText('教材を登録してから記録しましょう')).toBeVisible();
});
