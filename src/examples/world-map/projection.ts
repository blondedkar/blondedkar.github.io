export type PlanePoint = { x: number; y: number };
export type PixelPoint = { u: number; v: number };
export type ReferencePoint = { source: PlanePoint; pixel: PixelPoint };
export type Size = { width: number; height: number };

export function createProjection(points: readonly ReferencePoint[]) {
  if (points.length !== 3) {
    throw new Error("Provide exactly three source/pixel pairs.");
  }
  if (points.some(({ source, pixel }) =>
    ![source.x, source.y, pixel.u, pixel.v].every(Number.isFinite))) {
    throw new Error("Reference coordinates must be finite.");
  }

  const [a, b, c] = points;
  const bx = b.source.x - a.source.x;
  const by = b.source.y - a.source.y;
  const cx = c.source.x - a.source.x;
  const cy = c.source.y - a.source.y;
  const determinant = bx * cy - cx * by;
  const span = Math.max(Math.hypot(bx, by), Math.hypot(cx, cy));

  // Reject a collapsed or nearly collinear reference triangle.
  if (!Number.isFinite(determinant) || span === 0 ||
      Math.abs(determinant) <= span * span * 1e-8) {
    throw new Error("Spread the reference points into a wider triangle.");
  }

  // The inverse basis is calculated once, outside the update loop.
  const inverse = [cy, -cx, -by, bx].map(value => value / determinant);

  return ({ x, y }: PlanePoint): PixelPoint => {
    const dx = x - a.source.x;
    const dy = y - a.source.y;
    const s = inverse[0] * dx + inverse[1] * dy;
    const t = inverse[2] * dx + inverse[3] * dy;
    return {
      u: a.pixel.u + s * (b.pixel.u - a.pixel.u) + t * (c.pixel.u - a.pixel.u),
      v: a.pixel.v + s * (b.pixel.v - a.pixel.v) + t * (c.pixel.v - a.pixel.v),
    };
  };
}

export function fitToPanel(pixel: PixelPoint, imageSize: Size, panel: Size) {
  if (![imageSize.width, imageSize.height, panel.width, panel.height]
    .every(value => Number.isFinite(value) && value > 0)) {
    throw new Error("Image and panel dimensions must be positive.");
  }

  // Match an image displayed with a centered "contain" fit.
  const scale = Math.min(panel.width / imageSize.width, panel.height / imageSize.height);
  return {
    x: (panel.width - imageSize.width * scale) / 2 + pixel.u * scale,
    y: (panel.height - imageSize.height * scale) / 2 + pixel.v * scale,
    visible: Number.isFinite(pixel.u) && Number.isFinite(pixel.v) &&
      pixel.u >= 0 && pixel.u <= imageSize.width &&
      pixel.v >= 0 && pixel.v <= imageSize.height,
  };
}
