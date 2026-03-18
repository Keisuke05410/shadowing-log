import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Seed data: 1 material + sessions for yesterday and today
  await page.evaluate(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    const data = {
      materials: [
        {
          id: 'm1',
          name: 'TED Talk',
          lengthSeconds: 300,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      sessions: [
        {
          id: 's1',
          date: fmt(yesterday),
          materialId: 'm1',
          durationMinutes: 15,
          selfEvaluation: 4,
          createdAt: yesterday.toISOString(),
        },
      ],
    };
    localStorage.setItem('shadowing-log-data', JSON.stringify(data));
  });
  await page.goto('/');
});

test('日常ユーザー: ストリーク表示 → 記録 → 保存 → ダッシュボード更新', async ({ page }) => {
  // ストリークが表示されている
  await expect(page.getByText('日連続')).toBeVisible();
  // 「今日はまだ記録がありません」
  await expect(page.getByText('今日はまだ記録がありません')).toBeVisible();

  // 記録画面へ
  await page.getByText('今日のシャドーイング、始めますか？').click();
  await expect(page).toHaveURL(/\/#\/record/);

  // 記録
  await page.getByRole('button', { name: '10分' }).click();
  await page.getByRole('button', { name: '5点' }).click();
  await page.getByRole('button', { name: '記録を保存' }).click();

  // ダッシュボード
  await expect(page).toHaveURL(/\/#\//);
  await expect(page.getByText('済 ✓')).toBeVisible();
});
