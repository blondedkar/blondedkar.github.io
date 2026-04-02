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

    const tick = (Time: number) => {
      LenisInstance.raf(Time * 1000);
    };

    gsap.ticker.add(tick);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      LenisInstance.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}
