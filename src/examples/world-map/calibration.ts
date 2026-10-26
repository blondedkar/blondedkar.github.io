// Replace these pairs with measurements from your reference image.
export const imageSize = { width: 960, height: 720 };

export const referencePoints = [
  { source: { x: -600, y: -400 }, pixel: { u: 80, v: 100 } },
  { source: { x: 1000, y: -300 }, pixel: { u: 880, v: 140 } },
  { source: { x: -300, y: 800 }, pixel: { u: 160, v: 650 } },
] as const;
