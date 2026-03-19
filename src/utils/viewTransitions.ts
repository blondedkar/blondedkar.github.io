import type { NavigateFunction } from "react-router-dom";
import { flushSync } from "react-dom";
import { gsap } from "gsap";

const PENDING_SCROLL_TARGET_KEY = "pendingScrollTarget";
let isTransitioning = false;

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

export const projectDirections: Record<string, string> = {
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

export function getOppositeDirection(direction: string) {
  switch (direction) {
    case "up":
      return "down";
    case "right":
      return "left";
    case "down":
      return "up";
    case "left":
      return "right";
    default:
      return "down";
  }
}

function randomSignedOffset(min: number, max: number) {
  const magnitude = Math.round(min + Math.random() * (max - min));
  return `${Math.random() > 0.5 ? magnitude : -magnitude}px`;
}

function getTransitionShell() {
  return document.querySelector(".AppTransitionShell") as HTMLElement | null;
}

function getRouteContent() {
  return document.querySelector(".AppRouteContent") as HTMLElement | null;
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function isVisible(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function collectTransitionElements() {
  const routeContent = getRouteContent();
  if (!routeContent) return [];

  const selectors = [
    ":scope > *",
    ":scope > * > *",
    ":scope > * > main > *",
    ":scope > * > .MainContentArea > *",
    ":scope > * > .MainContentArea > main > *"
  ];

  const elements: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();

  selectors.forEach((selector) => {
    routeContent.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      if (seen.has(element) || !isVisible(element)) return;
      if (element.classList.contains("ScrollProgressBar")) return;
      if (getComputedStyle(element).position === "fixed") return;

      seen.add(element);
      elements.push(element);
    });
  });

  return elements.sort(
    (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
  );
}

function createTransitionState() {
  return {
    x: parseFloat(randomSignedOffset(18, 52)),
    y: parseFloat(randomSignedOffset(14, 40)),
    rotate: (Math.random() * 3 - 1.5),
    scaleOut: 0.64 + Math.random() * 0.12,
    scaleIn: 1.08 + Math.random() * 0.1,
    blurOut: 8 + Math.random() * 12,
    blurIn: 16 + Math.random() * 12
  };
}

async function animateOutgoingElements(elements: HTMLElement[]) {
  if (!elements.length) return;

  const states = elements.map(() => createTransitionState());

  await new Promise<void>((resolve) => {
    gsap.to(elements, {
      x: (index) => states[index].x,
      y: (index) => states[index].y,
      rotate: (index) => states[index].rotate,
      scale: (index) => states[index].scaleOut,
      opacity: (index) => Math.max(0.08, 0.22 - index * 0.01),
      filter: (index) => `blur(${states[index].blurOut}px)`,
      duration: 0.42,
      ease: "power2.inOut",
      stagger: {
        each: 0.028,
        from: "random"
      },
      onComplete: resolve
    });
  });
}

async function animateIncomingElements(elements: HTMLElement[]) {
  if (!elements.length) return;

  const states = elements.map(() => createTransitionState());

  gsap.set(elements, {
    x: (index) => states[index].x * -0.65,
    y: (index) => states[index].y * -0.65,
    rotate: (index) => states[index].rotate * -0.8,
    scale: (index) => states[index].scaleIn,
    opacity: 0,
    filter: (index) => `blur(${states[index].blurIn}px)`
  });

  await new Promise<void>((resolve) => {
    gsap.to(elements, {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.52,
      ease: "power3.out",
      stagger: {
        each: 0.022,
        from: "random"
      },
      clearProps: "transform,opacity,filter",
      onComplete: resolve
    });
  });
}

export async function navigateWithViewTransition(
  navigate: NavigateFunction,
  to: string,
  _transitionHint?: string,
  options?: {
    scrollTarget?: string;
  }
) {
  if (isTransitioning) return;

  const lenis = getLenis();
  const shell = getTransitionShell();
  const outgoingElements = collectTransitionElements();

  if (options?.scrollTarget) {
    sessionStorage.setItem(PENDING_SCROLL_TARGET_KEY, options.scrollTarget);
  } else {
    sessionStorage.removeItem(PENDING_SCROLL_TARGET_KEY);
  }

  isTransitioning = true;
  shell?.classList.add("CloudTransitioning");
  const performNavigation = () => {
    flushSync(() => {
      navigate(to);
    });
    resetPageScroll();
  };

  try {
    lenis?.stop?.();
    await animateOutgoingElements(outgoingElements);
    performNavigation();
    await nextFrame();
    resetPageScroll();
    await nextFrame();
    await animateIncomingElements(collectTransitionElements());
  } finally {
    lenis?.start?.();
    resetPageScroll();
    shell?.classList.remove("CloudTransitioning");
    isTransitioning = false;
  }
}

export function consumePendingScrollTarget() {
  const target = sessionStorage.getItem(PENDING_SCROLL_TARGET_KEY);
  if (target) {
    sessionStorage.removeItem(PENDING_SCROLL_TARGET_KEY);
  }
  return target;
}
