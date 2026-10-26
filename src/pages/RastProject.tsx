import ProjectGuide, {
  GuideInk as Ink,
  GuideCodeSample,
  GuideSection,
} from "../components/ProjectGuide";

const createCanvasCode = [
  "-- Supply these references from the host application.",
  "local RoffinityCanvas = require(canvasModule)",
  "",
  "local Canvas = RoffinityCanvas.new({",
  "    Parent = parent,",
  "    Width = 512,",
  "    Height = 512,",
  "    CanvasColour = Color3.new(1, 1, 1),",
  "    Blur = false,",
  "})",
  "",
  "assert(Canvas.EditableImage ~= nil, \"Image output is unavailable\")",
  "Canvas.AutoRender = false",
  "",
  "-- Storage resolution is separate from the displayed frame.",
  "assert(Canvas.CurrentResX == 1024 and Canvas.CurrentResY == 1024)"
].join("\n");

const writePixelsCode = [
  "-- Coordinates are one-based; RGBA channels use the range 0..1.",
  "Canvas:FillRGBA(1, 1, 1, 1)",
  "Canvas:SetRGBA(128, 128, 1, 0, 0, 1)",
  "",
  "Canvas:DrawRect(",
  "    240, 64, 128, 96,",
  "    Color3.new(0.2, 0.55, 0.8),",
  "    1",
  ")",
  "",
  "-- Present the complete batch once.",
  "Canvas:Render()"
].join("\n");

const coordinatesCode = [
  "local function ToCanvasPoint(screenPosition: Vector2): Vector2?",
  "    local point = Canvas:ViewportToCanvasPoint(screenPosition)",
  "",
  "    if point.X < 1 or point.Y < 1",
  "        or point.X > Canvas.CurrentResX",
  "        or point.Y > Canvas.CurrentResY then",
  "        return nil",
  "    end",
  "",
  "    return point",
  "end"
].join("\n");

const strokeCode = [
  "local active = false",
  "local previousPoint: Vector2? = nil",
  "local ink = Color3.new(0.1, 0.3, 0.4)",
  "",
  "local function StampPoint(point: Vector2)",
  "    Canvas:SetRGBA(point.X, point.Y, ink.R, ink.G, ink.B, 1)",
  "end",
  "",
  "local function BeginStroke(screenPosition: Vector2)",
  "    active = false",
  "    previousPoint = ToCanvasPoint(screenPosition)",
  "    if not previousPoint then return end",
  "",
  "    active = true",
  "    StampPoint(previousPoint)",
  "end",
  "",
  "local function MoveStroke(screenPosition: Vector2)",
  "    if not active then return end",
  "    local point = ToCanvasPoint(screenPosition)",
  "    if not point then",
  "        previousPoint = nil",
  "        return",
  "    end",
  "",
  "    if previousPoint then",
  "        Canvas:DrawLine(previousPoint, point, ink, 3)",
  "    else",
  "        StampPoint(point)",
  "    end",
  "    previousPoint = point",
  "end",
  "",
  "local function EndStroke()",
  "    active = false",
  "    previousPoint = nil",
  "end"
].join("\n");

const renderCode = [
  "-- Only dirty buffers are presented by the automatic update.",
  "Canvas.AutoRenderFpsLimit = 30",
  "Canvas.AutoRender = true",
  "",
  "-- Resize changes the frame, not the stored pixel grid.",
  "Canvas:Resize(768, 768)",
  "assert(Canvas.CurrentResX == 1024 and Canvas.CurrentResY == 1024)"
].join("\n");

const historyCode = [
  "local x, y, width, height = 32, 32, 64, 64",
  "local before = Canvas:GetBuffer(x, y, width, height)",
  "",
  "Canvas:DrawRect(x, y, width, height, Color3.new(0, 0.5, 1), 1)",
  "local after = Canvas:GetBuffer(x, y, width, height)",
  "",
  "local function UndoPatch()",
  "    Canvas:SetBuffer(before, x, y, width, height)",
  "end",
  "",
  "local function RedoPatch()",
  "    Canvas:SetBuffer(after, x, y, width, height)",
  "end"
].join("\n");

const verifyCode = [
  "local expectedBytes = Canvas.CurrentResX * Canvas.CurrentResY * 4",
  "assert(buffer.len(Canvas.Buffer) == expectedBytes)",
  "",
  "Canvas:SetRGBA(128, 128, 1, 0, 0, 1)",
  "local r, g, b, a = Canvas:GetRGBA(128, 128)",
  "assert(r == 1 and g == 0 and b == 0 and a == 1)",
  "",
  "Canvas:Render()"
].join("\n");

const cleanupCode = [
  "local function DisposeCanvas()",
  "    EndStroke()",
  "    -- Disconnect the host's pointer handlers before disposal.",
  "    Canvas.AutoRender = false",
  "    Canvas:Destroy()",
  "end"
].join("\n");

const sections = [
  { id: "prerequisites", title: "Prerequisites" },
  { id: "initial-setup", title: "Initial setup" },
  { id: "create-canvas", title: "1. Create the canvas" },
  { id: "write-pixels", title: "2. Write and present pixels" },
  { id: "convert-input", title: "3. Convert pointer coordinates" },
  { id: "draw-strokes", title: "4. Draw continuous strokes" },
  { id: "render-updates", title: "5. Schedule display updates" },
  { id: "region-history", title: "6. Capture reversible edits" },
  { id: "verify-output", title: "7. Verify the output" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "next-steps", title: "Next steps" },
];

const combinedCode = [
  createCanvasCode, writePixelsCode, coordinatesCode, strokeCode,
  renderCode, historyCode, verifyCode, cleanupCode,
].join("\n\n");
const downloadUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(combinedCode);

export default function RastProject() {
  return (
    <ProjectGuide
      title={<>CPU raster<br /><span>canvas.</span></>}
      lead="Create a CPU pixel canvas with continuous strokes, controlled rendering, and reversible edits."
      projectPath="/RastProject"
      sections={sections}
      articleLabel="CPU raster canvas setup guide"
    >
      <GuideSection id="prerequisites" title="Prerequisites">
        <p>A Luau runtime with buffers, editable image output, a visible UI container,
          and the RoffinityCanvas modules.</p>
      </GuideSection>

      <GuideSection id="initial-setup" title="Initial setup">
        <p>Provide <code>canvasModule</code> and <code>parent</code>. Append the samples in order,
          then bind the stroke callbacks to your input system.</p>
        <p>Drawing changes the buffer; rendering presents it.</p>
        <div className="MapGuideNote">
          <strong>Pixel convention</strong>
          <p>Pixels start at <code>(1, 1)</code>: X rightward, Y downward.
            Each uses four bytes in RGBA order.</p>
        </div>
      </GuideSection>

      <GuideSection id="create-canvas" title="1. Create the canvas">
        <p>Create the canvas and disable automatic rendering during initialization.</p>
        <GuideCodeSample title="Initialize the canvas" language="Luau" code={createCanvasCode} />
        <p><code>Width</code> and <code>Height</code> control the display.
          The buffer stays <Ink>1024 × 1024</Ink>, using 4 MiB for RGBA storage.</p>
      </GuideSection>

      <GuideSection id="write-pixels" title="2. Write and present pixels">
        <p>Fill the buffer, add a test pixel and rectangle, then call <code>Render</code> once.</p>
        <GuideCodeSample title="Write a test pattern" language="Luau" code={writePixelsCode} />
        <p><code>SetRGBA</code> uses 0–1 channels; the buffer stores 0–255.
          Calculate offsets using the internal width:</p>
        <div className="MapGuideEquation" aria-label="RGBA buffer byte offset">
          <code>offset = ((y − 1) × resolutionX + (x − 1)) × 4</code>
        </div>
        <p>RGBA occupies offsets 0 through 3. Successive pixels are four bytes apart.</p>
      </GuideSection>

      <GuideSection id="convert-input" title="3. Convert pointer coordinates">
        <p>Convert viewport positions with <code>ViewportToCanvasPoint</code>,
          then reject pixels outside the canvas.</p>
        <GuideCodeSample title="Convert and reject out-of-bounds input" language="Luau" code={coordinatesCode} />
        <p>The helper already adjusts for the UI inset. Do not subtract it twice.</p>
      </GuideSection>

      <GuideSection id="draw-strokes" title="4. Draw continuous strokes">
        <p>Join consecutive input samples with <Ink>line rasterization</Ink>.
          Reset the previous point when the pointer leaves the canvas.</p>
        <GuideCodeSample title="Stroke lifecycle callbacks" language="Luau" code={strokeCode} />
        <p>Bind <code>BeginStroke</code> to press, <code>MoveStroke</code> to movement,
          and <code>EndStroke</code> to release or cancellation—even outside the canvas.</p>
        <div className="MapGuideNote">
          <strong>Stroke shape</strong>
          <p>Lines use square stamps. Rounded caps and anti-aliasing are not implemented.</p>
        </div>
      </GuideSection>

      <GuideSection id="render-updates" title="5. Schedule display updates">
        <p>Automatic rendering presents dirty buffers, capped by <code>AutoRenderFpsLimit</code>.</p>
        <GuideCodeSample title="Control presentation and resizing" language="Luau" code={renderCode} />
        <p>Batch writes and <Ink>render once per update</Ink>.
          Resizing changes the display, not the pixel grid.</p>
        <p>Each render uploads the full buffer; region edits do not reduce upload size.</p>
      </GuideSection>

      <GuideSection id="region-history" title="6. Capture reversible edits">
        <p>Capture the affected region before and after an edit.
          A 64 × 64 RGBA snapshot uses 16 KiB.</p>
        <GuideCodeSample title="Save and restore a region" language="Luau" code={historyCode} />
        <p>Store each pair in the history stack. Capture once per stroke, limit memory,
          and clear the redo branch after a new edit.</p>
      </GuideSection>

      <GuideSection id="verify-output" title="7. Verify the output">
        <p>Check buffer length and read a known pixel, then render and inspect the pattern.</p>
        <GuideCodeSample title="Validate the buffer and a known pixel" language="Luau" code={verifyCode} />
        <div className="MapGuideTableWrap" tabIndex={0} aria-label="Raster canvas verification checks" data-lenis-prevent>
          <table>
            <caption>Expected behavior</caption>
            <thead><tr><th scope="col">Check</th><th scope="col">Expected result</th></tr></thead>
            <tbody>
              <tr><th scope="row">Internal storage</th><td>1024 × 1024 × 4 bytes</td></tr>
              <tr><th scope="row">Pixel at (128, 128)</th><td>RGBA (1, 0, 0, 1)</td></tr>
              <tr><th scope="row">Display resized to 768 × 768</th><td>Internal resolution stays 1024 × 1024</td></tr>
              <tr><th scope="row">Region restored</th><td>Pixels return to the captured snapshot</td></tr>
            </tbody>
          </table>
        </div>
        <p>Test strokes after resizing, then call <code>UndoPatch</code> and <code>RedoPatch</code>.
          Only the captured region should change.</p>
      </GuideSection>

      <GuideSection id="troubleshooting" title="Troubleshooting">
        <div className="MapGuideTroubleshooting">
          <div><h3>Blank display</h3>
            <p>Check image creation, parent visibility, and rendering. Pixel reads only verify storage.</p></div>
          <div><h3>Offset stroke</h3>
            <p>Use viewport coordinates and apply the inset adjustment once.</p></div>
          <div><h3>Broken or joined strokes</h3>
            <p>Connect samples, reset on exit, and handle release or cancellation globally.</p></div>
          <div><h3>Unexpected alpha behavior</h3>
            <p>Pixel writes replace RGBA. Source-over blending requires reading, blending, and writing the result.</p></div>
        </div>
      </GuideSection>

      <GuideSection id="next-steps" title="Next steps">
        <p>Extend with circular brushes, layers, or persistence.
          Keep image operations separate from rendering.</p>
        <p>Disconnect input handlers before <code>Destroy</code>,
          which stops internal updates and removes the display.</p>
        <GuideCodeSample title="Release the canvas" language="Luau" code={cleanupCode} />
        <div className="ProjectPanel MapGuideDownloads">
          <h3>Download the code samples</h3>
          <p>Supply the host references, bind stroke callbacks,
            and call <code>DisposeCanvas</code> when done.</p>
          <div><a href={downloadUrl} download="canvas-setup.luau">canvas-setup.luau ↓</a></div>
        </div>
      </GuideSection>
    </ProjectGuide>
  );
}
