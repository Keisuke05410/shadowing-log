export function secondsToMinSec(totalSeconds: number): { min: string; sec: string } {
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return { min: String(min), sec: String(sec).padStart(2, '0') };
}

export function formatLength(seconds: number): string {
  const { min, sec } = secondsToMinSec(seconds);
  return `${min}:${sec}`;
}
