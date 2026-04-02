import { useEffect, useRef } from "react";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import { usePerformanceMode } from "../hooks/usePerformanceMode";

function FogCanvas() {
  const ref = useRef<HTMLDivElement | null>(null);
  const effect = useRef<any>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    element.innerHTML = "";
    element.style.background = "transparent";

    const syncSize = () => {
      element.style.width = "100vw";
      element.style.height = "100dvh";
      element.style.minHeight = "100dvh";
      effect.current?.resize?.();
    };

    syncSize();

    if (!effect.current) {
      effect.current = FOG({
        el: element,
        THREE: THREE,
        highlightColor: 0xffffff,
        midtoneColor: 0xffffff,
        lowlightColor: 0x4ea5ac,
        baseColor: 0xd4dbdb,
        blurFactor: 0.67,
        speed: 3,
        zoom: 1
      });
    }

    const rafId = window.requestAnimationFrame(syncSize);
    window.addEventListener("resize", syncSize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", syncSize);
      effect.current?.destroy();
      effect.current = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "100dvh",
        minHeight: "100dvh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function FogFallback() {
  return (
    <div
      aria-hidden="true"
      className="FogBackgroundFallback"
      style={{
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "100dvh",
        minHeight: "100dvh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default function FogBackground() {
  const performanceMode = usePerformanceMode();

  if (performanceMode === "reduced") {
    return <FogFallback />;
  }

  return <FogCanvas key="fog-canvas" />;
}
