import type { NavigateFunction } from "react-router-dom";
import { flushSync } from "react-dom";

type Direction = "up" | "right" | "down" | "left";
const PENDING_SCROLL_TARGET_KEY = "pendingScrollTarget";

type LenisController = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      immediate?: boolean;
      force?: boolean;
      lock?: boolean;
    }
  ) => void;
  stop?: () => void;
  start?: () => void;
};

type ViewTransitionController = {
  ready?: Promise<void>;
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransitionController;
};

export const projectDirections: Record<string, Direction> = {
  "/SiteProject": "down",
  "/RastProject": "right",
  "/MappingProject": "up",
  "/SystemsProject": "left"
};

function getLenis() {
  return (window as typeof window & { lenis?: LenisController }).lenis;
}

export function resetPageScroll(target: number | HTMLElement = 0) {
  const lenis = getLenis();

  lenis?.scrollTo(target, {
    immediate: true,
    force: true,
    lock: true
  });

  const top =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({ top, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;

  requestAnimationFrame(() => {
    lenis?.scrollTo(target, {
      immediate: true,
      force: true,
      lock: true
    });
    window.scrollTo({ top, left: 0, behavior: "auto" });
  });
}

export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case "up":
      return "down";
    case "right":
      return "left";
    case "down":
      return "up";
    case "left":
      return "right";
  }
}

export function navigateWithViewTransition(
  navigate: NavigateFunction,
  to: string,
  direction: Direction,
  options?: {
    scrollTarget?: string;
  }
) {
  const doc = document as ViewTransitionDocument;
  const root = document.documentElement;
  const className = `vt-${direction}`;
  const lenis = getLenis();

  if (options?.scrollTarget) {
    sessionStorage.setItem(PENDING_SCROLL_TARGET_KEY, options.scrollTarget);
  } else {
    sessionStorage.removeItem(PENDING_SCROLL_TARGET_KEY);
  }

  const performNavigation = () => {
    flushSync(() => {
      navigate(to);
    });
    resetPageScroll();
  };

  if (!doc.startViewTransition) {
    performNavigation();
    return;
  }

  root.classList.add(className);
  lenis?.stop?.();

  const transition = doc.startViewTransition(() => {
    resetPageScroll();
    performNavigation();
  });

  transition.ready?.then(() => {
    resetPageScroll();
  });

  transition.finished.finally(() => {
    lenis?.start?.();
    resetPageScroll();
    root.classList.remove(className);
  });
}

export function consumePendingScrollTarget() {
  const target = sessionStorage.getItem(PENDING_SCROLL_TARGET_KEY);
  if (target) {
    sessionStorage.removeItem(PENDING_SCROLL_TARGET_KEY);
  }
  return target;
}
