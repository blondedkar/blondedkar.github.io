import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const LenisInstance = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    (window as any).lenis = LenisInstance;

    gsap.ticker.add((Time) => {
      LenisInstance.raf(Time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      LenisInstance.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}