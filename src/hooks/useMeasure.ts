import { useRef, useState, useLayoutEffect, RefObject } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export default function useMeasure(): [
  RefObject<HTMLDivElement>,
  { left: number; top: number; width: number; height: number }
] {
  const ref = useRef<HTMLDivElement>(null);
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [observer] = useState(() => new ResizeObserver(([{ contentRect }]) => set(contentRect)));
  useLayoutEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
      return (): void => observer.disconnect();
    }
  }, [observer]);
  return [ref, bounds];
}
