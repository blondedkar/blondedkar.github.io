import { referencePoints, imageSize } from "./calibration";
import { createProjection, fitToPanel } from "./projection";
import type { PlanePoint } from "./projection";

const project = createProjection(referencePoints);

// Supply coordinates from your application's data source.
export function startCoordinateTracking(
  panel: HTMLElement,
  marker: HTMLElement,
  getPosition: () => PlanePoint | null,
) {
  let frame = 0;
  let stopped = false;
  const previous = {
    position: marker.style.position,
    left: marker.style.left,
    top: marker.style.top,
    transform: marker.style.transform,
    hidden: marker.hidden,
  };
  marker.style.position = "absolute";
  marker.style.transform = "translate(-50%, -50%)";

  function update() {
    if (stopped) return;
    const point = getPosition();
    const width = panel.clientWidth;
    const height = panel.clientHeight;
    marker.hidden = true;

    if (point && width > 0 && height > 0) {
      const local = fitToPanel(project(point), imageSize, { width, height });
      marker.hidden = !local.visible;
      marker.style.left = local.x + "px";
      marker.style.top = local.y + "px";
    }
    frame = requestAnimationFrame(update);
  }
  update();

  // Call when the display is hidden, disposed, or replaced.
  return function stop() {
    stopped = true;
    cancelAnimationFrame(frame);
    marker.style.position = previous.position;
    marker.style.left = previous.left;
    marker.style.top = previous.top;
    marker.style.transform = previous.transform;
    marker.hidden = previous.hidden;
  };
}
