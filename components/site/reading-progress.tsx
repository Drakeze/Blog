'use client';

import { useEffect, useRef } from 'react';

/**
 * Left-edge rail that fills as the article is read, with a % readout. Uses a
 * CSS scroll-timeline where supported; otherwise a rAF-throttled scroll
 * listener. Hidden below `lg` (no gutter room) and for reduced-motion the fill
 * just doesn't animate - it still tracks.
 */
export function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    const pct = pctRef.current;
    if (!fill || !pct) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      fill.style.height = `${p}%`;
      pct.textContent = `${p}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-[max(1rem,calc(50vw-24rem))] top-24 bottom-16 z-10 hidden w-0.75 motion-reduce:hidden! lg:block"
    >
      <div className="relative h-full w-full rounded-full bg-border">
        <div ref={fillRef} className="absolute inset-x-0 top-0 rounded-full bg-primary" style={{ height: '0%' }} />
      </div>
      <span
        ref={pctRef}
        className="absolute -left-0.5 top-0 -translate-y-4 font-mono text-[0.62rem] text-faint [writing-mode:vertical-rl]"
      >
        0%
      </span>
    </div>
  );
}
