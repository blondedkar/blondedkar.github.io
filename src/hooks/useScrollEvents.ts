import { useEffect, useRef } from "react";

export type ScrollCallback = (
  scroll: number,
  velocity: number,
  direction: number
) => void;

export function useScrollEvents(callback: ScrollCallback) {
  const CallbackRef = useRef<ScrollCallback>(callback);

  useEffect(() => {
    CallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const LenisInstance = (window as any).lenis;
    if (!LenisInstance) return;

    const Handler = (e: any) => {
      CallbackRef.current(
        e.scroll,
        e.velocity ?? 0,
        e.direction ?? 0
      );
    };

    LenisInstance.on("scroll", Handler);

    return () => {
      LenisInstance.off("scroll", Handler);
    };
  }, []);
}