import ProjectGuide, {
  GuideInk as Ink,
  GuideCodeSample as CodeSample,
  GuideSection,
} from "../components/ProjectGuide";
import { referencePoints, imageSize } from "../examples/world-map/calibration";
import calibrationCode from "../examples/world-map/calibration.ts?raw";
import projectionCode from "../examples/world-map/projection.ts?raw";
import controllerCode from "../examples/world-map/controller.ts?raw";

const sections = [
  { id: "prerequisites", title: "Prerequisites" },
  { id: "initial-setup", title: "Initial setup" },
  { id: "prepare-image", title: "1. Prepare the image" },
  { id: "reference-points", title: "2. Record reference points" },
  { id: "solve-transform", title: "3. Solve the transform" },
  { id: "connect-indicator", title: "4. Connect the indicator" },
  { id: "verify-output", title: "5. Verify the output" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "next-steps", title: "Next steps" },
  { id: "further-reading", title: "Further reading" },
];
const calibrationUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(calibrationCode);
const projectionUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(projectionCode);
const controllerUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(controllerCode);
const integrationCode = [
  'import { startCoordinateTracking } from "./controller";', "",
  "// panel: relative positioning, no border or padding.",
  "// Fit the image with object-fit: contain; object-position: center.",
  "// marker: an absolute-positioned child of the same panel.",
  "// measurements.currentPosition is { x: number; y: number } | null.",
  "// Replace measurements with your application's data source.",
  "const stop = startCoordinateTracking(",
  "  panel, marker, () => measurements.currentPosition,",
  ");", "",
  "// Keep stop and call it when disposing of the display:",
  "// stop();",
  "// Start a fresh tracker when mounting the display again.",
].join("\n");

export default function MappingProject() {
  return (
    <ProjectGuide
      title={<>Affine coordinate<br /><span>mapping.</span></>}
      lead="Convert source coordinates into image positions using three reference pairs and an affine transform."
      projectPath="/MappingProject"
      sections={sections}
      articleLabel="Affine coordinate mapping guide"
    >
          <GuideSection id="prerequisites" title="Prerequisites">
            <p>A reference image with known dimensions, three non-collinear coordinate pairs,
              and a TypeScript browser app.</p>
          </GuideSection>
          <GuideSection id="initial-setup" title="Initial setup">
            <p>Store reference pairs in <code>calibration.ts</code>, calculate the transform in
              {" "}<code>projection.ts</code>, and update the display in <code>controller.ts</code>.</p>
            <div className="MapGuideNote"><strong>Coordinate convention</strong>
              <p>Source: <code>(x, y)</code>. Image: <code>(u, v)</code>, starting at the top-left,
                with U increasing rightward and V downward.</p></div>
          </GuideSection>
          <GuideSection id="prepare-image" title="1. Prepare the image">
            <p>Use a planar image, such as a floor plan or orthographic capture. Finish cropping,
              rotating, and resizing before recording its dimensions.</p>
            <p>Camera perspective may require a homography. Any later image edit requires
              <Ink>new pixel measurements</Ink>.</p>
          </GuideSection>
          <GuideSection id="reference-points" title="2. Record reference points">
            <p>Choose three widely spaced points forming a broad triangle. Record each source
              coordinate and its matching pixel. <Ink>Keep the pairs in the same order.</Ink></p>
            <div className="MapGuideTableWrap" tabIndex={0} aria-label="Example reference coordinates" data-lenis-prevent>
              <table><caption>Reference pairs · {imageSize.width} × {imageSize.height} image</caption>
                <thead><tr><th scope="col">Point</th><th scope="col">Source (X, Y)</th><th scope="col">Image (U, V)</th></tr></thead>
                <tbody>{referencePoints.map((point, index) => <tr key={index}>
                  <th scope="row">{["A", "B", "C"][index]}</th>
                  <td>({point.source.x}, {point.source.y})</td><td>({point.pixel.u}, {point.pixel.v})</td>
                </tr>)}</tbody></table>
            </div>
            <p>Save your measurements in <code>calibration.ts</code>.</p>
            <CodeSample title="calibration.ts" code={calibrationCode} />
          </GuideSection>
          <GuideSection id="solve-transform" title="3. Solve the transform">
            <p>Three reference pairs determine six coefficients:</p>
            <div className="MapGuideEquation" aria-label="Affine equations">
              <code>u = a·x + b·y + c</code><code>v = d·x + e·y + f</code>
            </div>
            <p>Express each source point in the reference basis, then apply those weights to the
              pixel positions. <Ink>Calculate the inverse once</Ink>.</p>
            <CodeSample title="projection.ts" code={projectionCode} />
            <div className="MapGuideNote"><strong>Where affine calibration applies</strong>
              <p>Affine transforms support translation, rotation, scale, reflection, and shear.
                Perspective on a plane needs a homography with at least four suitable pairs.
                Non-planar surfaces need another model.</p></div>
          </GuideSection>
          <GuideSection id="connect-indicator" title="4. Connect the indicator">
            <p>Place the image and marker in one relative-positioned panel with no border or padding.
              Use a centered <code>contain</code> fit.</p>
            <p><code>fitToPanel</code> accounts for scale and empty margins. Read the current panel size after resizing.</p>
            <CodeSample title="controller.ts" code={controllerCode} />
            <p>The callback returns <code>(x, y)</code> or <code>null</code>.
              Replace <code>measurements</code> with your data source; call cleanup when removing the display.</p>
            <CodeSample title="Connect a coordinate source" code={integrationCode} />
          </GuideSection>
          <GuideSection id="verify-output" title="5. Verify the output">
            <p>Check the reference pairs, then an independent point. Its residual error is the
              distance between predicted and measured pixels.</p>
            <p>Resizing should change display coordinates, not image coordinates.</p>
            <div className="MapGuideNote"><strong>Expected result</strong>
              <p>Source point A <code>(−600, −400)</code> maps to pixel <code>(80, 100)</code>.</p></div>
          </GuideSection>
          <GuideSection id="troubleshooting" title="Troubleshooting">
            <div className="MapGuideTroubleshooting">
              <div><h3>Constant offset</h3>
                <p>Check the marker anchor and image margins. A fixed offset cannot correct errors that vary across the image.</p></div>
              <div><h3>Drift near the edges</h3>
                <p>Verify dimensions and reference pairs, then check for perspective or non-planar geometry.</p></div>
              <div><h3>Rejected reference points</h3>
                <p>The reference triangle is too narrow. Move one point farther from the line through the other two.</p></div>
              <div><h3>Hidden marker</h3>
                <p>Positions outside the image are hidden. Clip display coordinates only; preserve the original transform output.</p></div>
            </div>
          </GuideSection>
          <GuideSection id="next-steps" title="Next steps">
            <p>Use least squares for noisy reference sets. Apply display pan, zoom, and rotation
              to the image and overlays together.</p>
            <div className="ProjectPanel MapGuideDownloads">
              <h3>Download the source</h3>
              <p>Save the three files together and replace the calibration values.</p>
              <div><a href={calibrationUrl} download="calibration.ts">calibration.ts ↓</a>
                <a href={projectionUrl} download="projection.ts">projection.ts ↓</a>
                <a href={controllerUrl} download="controller.ts">controller.ts ↓</a></div>
            </div>
          </GuideSection>
          <GuideSection id="further-reading" title="Further reading">
            <div className="MapGuideResources">
              <div>
                <h3><a href="https://www.youtube.com/watch?v=kYB8IZa5AuE"
                  target="_blank" rel="noopener noreferrer">3Blue1Brown: Linear transformations and matrices</a></h3>
                <p>How basis vectors and matrices transform coordinates.</p>
              </div>
              <div>
                <h3><a href="https://www.3blue1brown.com/lessons/determinant/"
                  target="_blank" rel="noopener noreferrer">3Blue1Brown: The determinant</a></h3>
                <p>Why collinear points produce singular systems.</p>
              </div>
              <div>
                <h3><a href="https://www.mathworks.com/help/images/matrix-representation-of-geometric-transformations.html"
                  target="_blank" rel="noopener noreferrer">MathWorks: Affine transformation matrices</a></h3>
                <p>Matrix forms for translation, rotation, scale, reflection, and shear.</p>
              </div>
              <div>
                <h3><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-16-projection-matrices-and-least-squares/"
                  target="_blank" rel="noopener noreferrer">MIT OpenCourseWare: Least squares</a></h3>
                <p>Fit coefficients from noisy, overdetermined measurements.</p>
              </div>
            </div>
          </GuideSection>
    </ProjectGuide>
  );
}
