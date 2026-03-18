const POSITIVE_MESSAGES = [
  'いい調子！',
  'お疲れさまでした！',
  '継続は力なり！',
  '素晴らしい！',
  'ナイスシャドーイング！',
  '今日もやりましたね！',
  'コツコツが大事！',
];

let lastIndex = -1;

export function getPositiveMessage(): string {
  let index: number;
  do {
    index = Math.floor(Math.random() * POSITIVE_MESSAGES.length);
  } while (index === lastIndex && POSITIVE_MESSAGES.length > 1);
  lastIndex = index;
  return POSITIVE_MESSAGES[index];
}

export const RETURNING_MESSAGE = '戻ってきましたね！';
