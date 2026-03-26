import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, durationMs = 800): number {
  const [value, setValue] = useState(0);
  const rafId = useRef(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }

    const start = performance.now();

    function tick(now: number) {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) ** 3; // ease-out cubic
      setValue(Math.round(eased * target));

      if (t < 1) {
        rafId.current = requestAnimationFrame(tick);
      }
    }

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, durationMs]);

  return value;
}
