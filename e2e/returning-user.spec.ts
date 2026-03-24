import { test, expect } from '@playwright/test';
import { formatLocalDate } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const fourDaysAgo = new Date();
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

  await page.evaluate(
    (seed) => {
      localStorage.setItem('shadowing-log-data', JSON.stringify(seed));
    },
    {
      materials: [
        {
          id: 'm1',
          name: 'Podcast',
          lengthSeconds: 600,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      sessions: [
        {
          id: 's1',
          date: formatLocalDate(fiveDaysAgo),
          materialId: 'm1',
          durationMinutes: 20,
          selfEvaluation: 3,
          createdAt: fiveDaysAgo.toISOString(),
        },
        {
          id: 's2',
          date: formatLocalDate(fourDaysAgo),
          materialId: 'm1',
          durationMinutes: 15,
          selfEvaluation: 4,
          createdAt: fourDaysAgo.toISOString(),
        },
      ],
    },
  );
  await page.goto('/');
});

test('復帰ユーザー: 断絶メッセージ → 記録 → 「戻ってきましたね！」トースト', async ({ page }) => {
  // 断絶メッセージ
  await expect(page.getByText('また今日から始めましょう')).toBeVisible();

  // 記録画面へ
  await page.getByText('今日のシャドーイング、始めますか？').click();

  // 記録
  await page.getByRole('button', { name: '10分' }).click();
  await page.getByRole('button', { name: '3点' }).click();
  await page.getByRole('button', { name: '記録を保存' }).click();

  // 復帰トースト
  await expect(page.getByText('戻ってきましたね！')).toBeVisible();
});
