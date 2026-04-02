export type PerformanceMode = "default" | "reduced";
export type PerformanceModeOverride = PerformanceMode | "auto";

const MODE_EVENT = "performance-modechange";
const REDUCED_CLASS = "performance-mode-reduced";
const OVERRIDE_STORAGE_KEY = "performanceModeOverride";

type NavigatorWithHints = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

function getNavigatorHints() {
  return navigator as NavigatorWithHints;
}

type WebGLRendererInfo = {
  vendor: string | null;
  renderer: string | null;
  accelerationLikelyDisabled: boolean;
};

function isPerformanceMode(value: string | null): value is PerformanceMode {
  return value === "default" || value === "reduced";
}

function isPerformanceModeOverride(
  value: string | null
): value is PerformanceModeOverride {
  return value === "auto" || isPerformanceMode(value);
}

function getUrlOverride(): PerformanceModeOverride | null {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("performance");
  return isPerformanceModeOverride(value) ? value : null;
}

function getStoredOverride(): PerformanceModeOverride | null {
  try {
    const value = window.localStorage.getItem(OVERRIDE_STORAGE_KEY);
    return isPerformanceModeOverride(value) ? value : null;
  } catch {
    return null;
  }
}

function setStoredOverride(mode: PerformanceModeOverride) {
  try {
    if (mode === "auto") {
      window.localStorage.removeItem(OVERRIDE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(OVERRIDE_STORAGE_KEY, mode);
  } catch {
    // Ignore storage failures.
  }
}

export function getPerformanceModeOverride(): PerformanceModeOverride {
  return getUrlOverride() ?? getStoredOverride() ?? "auto";
}

function getWebGLRendererInfo(): WebGLRendererInfo {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      return {
        vendor: null,
        renderer: null,
        accelerationLikelyDisabled: true,
      };
    }

    const debugInfo = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_debug_renderer_info"
    );

    if (!debugInfo) {
      return {
        vendor: null,
        renderer: null,
        accelerationLikelyDisabled: false,
      };
    }

    const vendor = String(
      (gl as WebGLRenderingContext).getParameter(
        debugInfo.UNMASKED_VENDOR_WEBGL
      ) ?? ""
    );
    const renderer = String(
      (gl as WebGLRenderingContext).getParameter(
        debugInfo.UNMASKED_RENDERER_WEBGL
      ) ?? ""
    );

    const combined = `${vendor} ${renderer}`.toLowerCase();
    const accelerationLikelyDisabled =
      /swiftshader|software|llvmpipe|warp|basic render|microsoft basic render|mesa offscreen/.test(
        combined
      );

    return {
      vendor,
      renderer,
      accelerationLikelyDisabled,
    };
  } catch {
    return {
      vendor: null,
      renderer: null,
      accelerationLikelyDisabled: true,
    };
  }
}

function getHeuristicMode(): PerformanceMode {
  const override = getPerformanceModeOverride();
  if (override !== "auto") {
    return override;
  }

  const nav = getNavigatorHints();
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || nav.connection?.saveData) {
    return "reduced";
  }

  const rendererInfo = getWebGLRendererInfo();

  if (rendererInfo.accelerationLikelyDisabled) {
    return "reduced";
  }

  return "default";
}

export function applyPerformanceMode(mode: PerformanceMode) {
  document.documentElement.dataset.performanceMode = mode;
  document.documentElement.classList.toggle(REDUCED_CLASS, mode === "reduced");
  window.dispatchEvent(new CustomEvent<PerformanceMode>(MODE_EVENT, { detail: mode }));
}

export function setPerformanceModeOverride(mode: PerformanceModeOverride) {
  setStoredOverride(mode);
  const nextMode = mode === "auto" ? getHeuristicMode() : mode;
  applyPerformanceMode(nextMode);
  return nextMode;
}

export function getGraphicsAccelerationInfo() {
  const override = getPerformanceModeOverride();
  const rendererInfo = getWebGLRendererInfo();

  return {
    override,
    mode: getPerformanceMode(),
    vendor: rendererInfo.vendor,
    renderer: rendererInfo.renderer,
    accelerationLikelyDisabled: rendererInfo.accelerationLikelyDisabled,
  };
}

export function getPerformanceMode(): PerformanceMode {
  const current = document.documentElement.dataset.performanceMode;
  if (current === "reduced" || current === "default") {
    return current;
  }

  return getHeuristicMode();
}

export function initializePerformanceMode() {
  const mode = getHeuristicMode();
  applyPerformanceMode(mode);
  return mode;
}

export async function monitorPerformanceMode() {
  return getPerformanceMode();
}

export function subscribeToPerformanceMode(
  callback: (mode: PerformanceMode) => void
) {
  const handler = (event: Event) => {
    callback((event as CustomEvent<PerformanceMode>).detail);
  };

  window.addEventListener(MODE_EVENT, handler);
  return () => window.removeEventListener(MODE_EVENT, handler);
}
