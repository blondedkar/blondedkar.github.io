import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../substyle.css";
import {
  consumePendingScrollTarget,
  getOppositeDirection,
  navigateWithViewTransition,
  projectDirections,
  resetPageScroll
} from "../utils/viewTransitions";

gsap.registerPlugin(ScrollTrigger);

function AnimatedActionLabel({ label }: { label: string }) {
  return (
    <>
      <span className="hidden" aria-hidden="true">
        {label}
      </span>

      <span className="top" aria-hidden="true">
        {[...label].map((letter, i) => (
          <span
            key={`top-${label}-${i}`}
            className="topLetter"
            style={{ transitionDelay: `${i * 0.02}s` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </span>

      <span className="bottom" aria-hidden="true">
        {[...label].map((letter, i) => (
          <span
            key={`bottom-${label}-${i}`}
            className="bottomLetter"
            style={{ transitionDelay: `${i * 0.02}s` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </span>
    </>
  );
}

function SplitPromptLabel({ label }: { label: string }) {
  return (
    <span className="ResourcePrompt" aria-hidden="true">
      {[...label].map((letter, index) => (
        <span
          key={`${label}-${index}`}
          className="ResourcePromptChar"
          style={{ transitionDelay: `${index * 0.025}s` }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

const heroTechColumns = {
  left: [{ label: "Luau", logo: "/Luau.svg" }],
  right: [{ label: "Lua", logo: "/Lua.svg" }]
};

const typeReferenceLinks: Record<string, string> = {
  canvas:
    "https://github.com/Ethanthegrand/CanvasDraw/blob/main/src/FastCanvas.luau",
  color3:
    "https://create.roblox.com/docs/reference/engine/datatypes/Color3",
  editableimage:
    "https://create.roblox.com/docs/reference/engine/classes/EditableImage",
  vector2:
    "https://create.roblox.com/docs/reference/engine/datatypes/Vector2"
};

function renderLinkedSignature(signature: string) {
  return signature.split(/(\b[A-Za-z][A-Za-z0-9]*\??\b)/g).map((part, index) => {
    const normalized = part.replace(/\?$/, "").toLowerCase();
    const href = typeReferenceLinks[normalized];

    if (!href) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <a
        key={`${part}-${index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="DocsTypeLink"
      >
        {part}
      </a>
    );
  });
}

function renderLinkedText(text: string) {
  return text.split(/(\b[A-Za-z][A-Za-z0-9]*\b)/g).map((part, index) => {
    const href = typeReferenceLinks[part.toLowerCase()];

    if (!href) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <a
        key={`${part}-${index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="DocsTypeLink"
      >
        {part}
      </a>
    );
  });
}

const memberGroups = [
  {
    title: "Related services/API",
    items: [
      "UserInputService",
      "CanvasDraw",
      "Proprietary Undo/Redo library",
      "ProfileStore",
    ]
  },
  {
    title: "Brushes",
    items: [
      "Round()",
      "Square()",
      "Flat()",
      "Glow()",
      "Blend()",
      "Smudge()",
      "Darken()",
      "Lighten()",
      "Eraser()",
      "Ignore()"
    ]
  },
];

const propertyEntries = [
  {
    name: "UserInputService",
    type: "library",
    summary: "Using events from UserInputService to drive brush strokes and user interactions.",
    resourceUrl:
      "https://create.roblox.com/docs/reference/engine/classes/UserInputService"
  },
  {
    name: "CanvasDraw",
    type: "library",
    summary: "Custom wrapper that manages buffers and efficiently reduces pixel update sytanx.",
    resourceUrl:
      "https://github.com/Ethanthegrand/CanvasDraw/tree/main/src"
  },
  {
    name: "Undo/Redo Stack",
    type: "module",
    summary: "Proprietary module that efficiently tracks changes relative to the current canvas, designed to be lagless, efficient and customizable."
  },
  {
    name: "ProfileStore",
    type: "library",
    summary: "DataStore wrapper, chosen for efficiency and data corruption safety.",
    resourceUrl: "https://madstudioroblox.github.io/ProfileStore/"
  }
];

const apiSections = [
  {
    title: "Constructor",
    entries: [
      {
        name: "RoffinityCanvas.new(parent: CanvasGroup, resolution: Vector2?, canvasColour: Color3?, blur: boolean?)",
        signatures: [
          "RoffinityCanvas.new(parent: Instance, resolution: number | vector2?, canvasColour: color3?, blur: boolean?): canvas"
        ],
        summary: "Creates a canvas object within a given parent, of a given resolution no greater than 1024x1024. Optional canvas background color, and blur to indicate default roblox anti-aliasing (not suggested)."
      }
    ]
  },
  {
    title: "Canvas Properties",
    entries: [
      {
        name: "Prefix: self, or Canvas",
        items: [
          "Frame, Container, ImageLabel, EditableImage",
          "Buffer",
          "AutoRender",
          "AutoRenderFpsLimit",
          "NeedsRender",
          "CanvasColour",
          "ClearAlpha",
          "Resolution, CurrentResX, CurrentResY",
          "Width, Height",
          "OnRendered"
        ],
        summary: "Accessible properties pertaining to the canvas."
      }
    ]
  },
  {
    title: "Pixel Read / Write API",
    entries: [
      { name: "SetPixel",signatures: ["Canvas:SetPixel(point: vector2, color: color3, alpha: number?): ()"], summary: "Internally writes a pixel to the buffer. Not suggested for work, this is an internal method but can be utilized."},
      { name: "SetRGB", signatures: ["Canvas:SetRGB(x: number, y: number, r: number, g: number, b: number): ()"], summary: "Writes pixel data with color values. Not suggested unless working explicitly without alpha." },
      { name: "SetRGBA", signatures: ["Canvas:SetRGBA(x: number, y: number, r: number, g: number, b: number, a: number?): ()"], summary: "Writes pixel data data with color value and alpha. This is the optimal pixel writing method." },
      { name: "SetAlpha", signatures: ["Canvas:SetAlpha(x: number, y: number, alpha: number): ()"], summary: "Sets the alpha value for a pixel, can overwrite existing alpha, and pixels." },
      { name: "SetU32", signatures: ["Canvas:SetU32(x: number, y: number, colourU32: number): ()"], summary: "Writes a 32-bit color value to the buffer, not suggested for work, this is an internal method." },
      { name: "GetPixel", signatures: ["Canvas:GetPixel(point: vector2): color3, number"], summary: "Reads and returns a pixel's RGBA and Alpha value. Not suggested for work." },
      { name: "GetRGB", signatures: ["Canvas:GetRGB(x: number, y: number): number, number, number"], summary: "Reads and returns a pixel's RGB values" },
      { name: "GetRGBA", signatures: ["Canvas:GetRGBA(x: number, y: number): number, number, number, number"], summary: "Reads and returns a pixel's RGBA values" },
      { name: "GetAlpha", signatures: ["Canvas:GetAlpha(x: number, y: number): number"], summary: "Reads and returns a pixel's alpha value" },
      { name: "GetU32", signatures: ["Canvas:GetU32(x: number, y: number): number"], summary: "Reads and returns a pixel's 32-bit color value" }
    ]
  },
  {
    title: "Buffer API",
    entries: [
      {
        name: "SetBuffer",
        signatures: ["Canvas:SetBuffer(pixelBuffer: buffer, x: number?, y: number?, bufferWidth: number?, bufferHeight: number?): ()"]
      },
      {
        name: "GetBuffer",
        signatures: ["Canvas:GetBuffer(x: number?, y: number?, width: number?, height: number?): buffer"]
      },
      {
        name: "Format",
        items: [
          "RGBA bytes",
          "4 bytes per pixel",
          "Offset formula: ((y - 1) * width + (x - 1)) * 4"
        ]
      }
    ]
  },
  {
    title: "Fill / Clear",
    entries: [
      { name: "Fill", signatures: ["Canvas:Fill(color: color3, alpha: number?): ()"] },
      { name: "FillRGBA", signatures: ["Canvas:FillRGBA(r: number, g: number, b: number, a: number?): ()"] },
      { name: "Clear", signatures: ["Canvas:Clear(): ()"] },
      { name: "SetClearRGBA", signatures: ["Canvas:SetClearRGBA(r: number, g: number, b: number, a: number): ()"] }
    ]
  },
  {
    title: "Drawing",
    entries: [
      { name: "DrawLine", signatures: ["Canvas:DrawLine(pointA: vector2, pointB: vector2, color: color3, thickness: number?, roundedCaps: boolean?): ()"] },
      { name: "DrawRectangle", signatures: ["Canvas:DrawRectangle(pointA: vector2, pointB: vector2, color: color3, alpha: number?, fill: boolean?): ()"] },
      { name: "DrawRect", signatures: ["Canvas:DrawRect(x: number, y: number, width: number, height: number, color: color3, alpha: number?): ()"] },
      {
        name: "Current limitations",
        items: [
          "roundedCaps is accepted but not fully implemented",
          "Line thickness is square-stamped rather than anti-aliased"
        ]
      }
    ]
  },
  {
    title: "Sizing",
    entries: [
      { name: "Resize", signatures: ["Canvas:Resize(newResolutionOrWidth: number | vector2, height: number?): ()"], items: ["Changes displayed frame size"] },
      { name: "SetResolution", signatures: ["Canvas:SetResolution(newResolutionOrWidth: number | vector2, height: number?): ()"], items: ["Changes internal buffer resolution", "Recreates the buffer and EditableImage"] }
    ]
  },
  {
    title: "Rendering",
    entries: [
      { name: "Render", signatures: ["Canvas:Render(): ()"] },
      { name: "AutoRender", items: ["Canvas.AutoRender"] },
      { name: "AutoRenderFpsLimit", items: ["Canvas.AutoRenderFpsLimit"] },
      { name: "NeedsRender", items: ["Canvas.NeedsRender"] },
      { name: "OnRendered", items: ["Canvas.OnRendered"] },
      { name: "SetBlur", signatures: ["Canvas:SetBlur(enabled: boolean): ()"] },
      { name: "SetStretchToFit", signatures: ["Canvas:SetStretchToFit(enabled: boolean): ()"] }
    ]
  },
  {
    title: "Input Helpers",
    entries: [
      { name: "ViewportToCanvasPoint", signatures: ["Canvas:ViewportToCanvasPoint(screenPosition: vector2): vector2"] },
      { name: "GetMousePoint", signatures: ["Canvas:GetMousePoint(): vector2"] },
      { name: "MouseIsOnTop", signatures: ["Canvas:MouseIsOnTop(): boolean"] }
    ]
  },
  {
    title: "Color Utilities",
    entries: [
      { name: "GetColourU32", signatures: ["RoffinityCanvas.GetColourU32(r: number, g: number, b: number, a: number?): number", "Canvas:GetColourU32(r: number, g: number, b: number, a: number?): number"] },
      { name: "GetRGBAFromColourU32", signatures: ["RoffinityCanvas.GetRGBAFromColourU32(colourU32: number): number, number, number, number", "Canvas:GetRGBAFromColourU32(colourU32: number): number, number, number, number"] },
      { name: "GetRGBFromColourU32", signatures: ["RoffinityCanvas.GetRGBFromColourU32(colourU32: number): number, number, number", "Canvas:GetRGBFromColourU32(colourU32: number): number, number, number"] }
    ]
  },
  {
    title: "Lifecycle",
    entries: [
      {
        name: "Destroy",
        signatures: ["Canvas:Destroy(): ()"],
        items: [
          "Disconnects the heartbeat connection",
          "Cleans up the events folder",
          "Destroys the GUI frame",
          "Clears EditableImage and buffer references"
        ]
      }
    ]
  },
  {
    title: "Performance Notes",
    entries: [
      {
        name: "Guidelines",
        items: [
          "Prefer bulk buffer operations for large changes",
          "Batch writes when possible",
          "AutoRenderFpsLimit can prevent excessive rendering",
          "Avoid reading or writing huge regions per frame unless using a preview strategy"
        ]
      }
    ]
  },
  {
    title: "Examples",
    entries: [
      { name: "Create canvas", signatures: ["local Canvas = RoffinityCanvas.new({ Parent = script.Parent, Width = 512, Height = 512 })"] },
      { name: "Draw pixel / line / rectangle", signatures: ["Canvas:SetPixel(Vector2.new(12, 20), Color3.new(1, 0, 0), 1)", "Canvas:DrawLine(Vector2.new(1, 1), Vector2.new(128, 64), Color3.new(1, 1, 1), 3)", "Canvas:DrawRect(24, 24, 80, 40, Color3.new(0, 0, 0), 1)"] },
      { name: "Read and modify a region", signatures: ["local Region = Canvas:GetBuffer(1, 1, 64, 64)", "Canvas:SetBuffer(Region, 96, 96, 64, 64)"] },
      { name: "Convert mouse position to canvas pixel", signatures: ["local Point = Canvas:GetMousePoint()", "local PointFromViewport = Canvas:ViewportToCanvasPoint(UserInputService:GetMouseLocation())"] },
      { name: "Resize display vs change resolution", signatures: ["Canvas:Resize(768, 768)", "Canvas:SetResolution(512, 512)"] },
      { name: "Manual render loop", signatures: ["Canvas.AutoRender = false", "Canvas:SetPixel(1, 1, Color3.new(1, 1, 1), 1)", "Canvas:Render()"] }
    ]
  }
] as const;

export default function RastProject() {
  const pageRef = useRef<HTMLElement>(null);
  const docsShellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const pendingTarget = consumePendingScrollTarget();
    const target: number | HTMLElement =
      !pendingTarget || pendingTarget === "project-hero"
        ? 0
        : (document.getElementById(pendingTarget) ?? 0);

    const alignToTarget = () => {
      resetPageScroll(target);
    };

    alignToTarget();

    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      alignToTarget();
    });

    const timeoutId = window.setTimeout(() => {
      ScrollTrigger.refresh();
      alignToTarget();
    }, 120);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".TechColumnLeft",
        { yPercent: 0 },
        {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

      gsap.fromTo(
        ".TechColumnRight",
        { yPercent: 0 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

      gsap.set(".DocsReferenceHero > *", {
        opacity: 0,
        y: 32
      });

      const heroTimeline = gsap.timeline({
        defaults: { ease: "power3.out" }
      });

      heroTimeline.to(".DocsReferenceHero > *", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="ProjectPage DocsProjectPage DocsReferencePage">
      <section id="project-hero" className="DocsReferenceHero DocsReferenceHeroWithVisual ProjectHero">
        <div className="ProjectHeroCopy">
          <h1 className="SiteTitle">Rasterizer</h1>
          <div className="DocsReferenceBadgeRow">
          </div>
          <p className="ProjectLead">
            Photoshop style emulator built completely CPU bound (by constraint, not idea). Project is completely written in Luau with the brush techniques being mathematically compatible in other programs.
          </p>

          <div className="ProjectActionRow">
            <Link
              to="/home"
              className="ProjectAction AnimatedTextContainer"
              onClick={(event) => {
                event.preventDefault();
                navigateWithViewTransition(
                  navigate,
                  "/home",
                  getOppositeDirection(projectDirections["/RastProject"])
                );
              }}
            >
              <AnimatedActionLabel label="Back to Projects" />
            </Link>
          </div>
        </div>

        <div className="ProjectHeroVisual RasterHeroVisual" aria-hidden="true">
          <div className="TechColumn TechColumnLeft">
            {heroTechColumns.left.map((item) => (
              <article key={item.label} className="TechBadgeCard">
                <div className="TechBadgeMark">{item.label}</div>
                <div className="TechLogoPlaceholder">
                  <img
                    src={item.logo}
                    alt={`${item.label} logo`}
                    className="TechLogoImage"
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="TechColumn TechColumnRight">
            {heroTechColumns.right.map((item) => (
              <article key={item.label} className="TechBadgeCard">
                <div className="TechBadgeMark">{item.label}</div>
                <div className="TechLogoPlaceholder">
                  <img
                    src={item.logo}
                    alt={`${item.label} logo`}
                    className="TechLogoImage"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div ref={docsShellRef} className="DocsShell DocsReferenceShell">
        <aside className="DocsSidebar">
          <div className="ProjectPanel DocsSidebarCard DocsReferenceStatusCard">
            <h2 className="DocsSidebarTitle">Project Facts</h2>
            <div className="DocsMetaList">
              <div className="DocsMetaRow">
                <span className="DocsMetaLabel">Runtime</span>
                <span className="DocsMetaValue">Luau</span>
              </div>
              <div className="DocsMetaRow">
                <span className="DocsMetaLabel">Canvas Layer</span>
                <span className="DocsMetaValue">
                  {renderLinkedText("CanvasDraw + EditableImage")}
                </span>
              </div>
              <div className="DocsMetaRow">
                <span className="DocsMetaLabel">Input</span>
                <span className="DocsMetaValue">UserInputService-driven brush system</span>
              </div>
              <div className="DocsMetaRow">
                <span className="DocsMetaLabel">Persistence</span>
                <span className="DocsMetaValue">ProfileStore-backed save data</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="DocsMain">
          <section id="rast-summary" className="DocsReferenceSection">
            <div className="SectionHeadingRow">
              <h2 className="ProjectSectionTitle">Summary</h2>
            </div>

            <article className="ProjectPanel DocsReferenceTable">
              <div className="DocsReferenceRow">
                <div className="DocsReferenceKey">Description</div>
                <div className="DocsReferenceValue">
                  {renderLinkedText(
                    "Utilize CanvasDraw's API to render pixels onto an EditableImage to emulate rasterized drawing. Incorporates various brush algorithms, multiple layers, saving/loading efficient flood fills, color picking, color blending, far beyond the average drawing program on the platform."
                  )}
                </div>
              </div>
              <div className="DocsReferenceRow">
                <div className="DocsReferenceKey">Responsibilities</div>
                <div className="DocsReferenceValue">
                  Efficiently map pixels to user inputted positions, provide a perfectly smooth, and detailed experience.
                </div>
              </div>
            </article>
          </section>

          <section id="rast-members" className="DocsReferenceSection">
            <div className="SectionHeadingRow">
              <h2 className="ProjectSectionTitle">Members Index</h2>
            </div>

            <div className="ProjectCardGrid DocsReferenceIndex">
              {memberGroups.map((group) => (
                <article key={group.title} className="ProjectPanel DocsReferenceListCard">
                  <h3>{group.title}</h3>
                  <ul className="DocsReferenceList">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="rast-properties" className="DocsReferenceSection">
            <div className="SectionHeadingRow">
              <h2 className="ProjectSectionTitle">Services</h2>
            </div>

            <div className="DocsReferenceEntries">
              {propertyEntries.map((entry) =>
                entry.resourceUrl ? (
                  <a
                    key={entry.name}
                    href={entry.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ProjectPanel DocsReferenceTable ResourceCard"
                  >
                    <div className="DocsReferenceEntryHeader">
                      <h3>{entry.name}</h3>
                      <span className="DocsReferenceType">{entry.type}</span>
                    </div>
                    <p>{entry.summary}</p>
                    <SplitPromptLabel label="View Resource" />
                  </a>
                ) : (
                  <article key={entry.name} className="ProjectPanel DocsReferenceTable">
                    <div className="DocsReferenceEntryHeader">
                      <h3>{entry.name}</h3>
                      <span className="DocsReferenceType">{entry.type}</span>
                    </div>
                    <p>{entry.summary}</p>
                  </article>
                )
              )}
            </div>
          </section>

          <section id="rast-methods" className="DocsReferenceSection">
            <div className="SectionHeadingRow">
              <h2 className="ProjectSectionTitle">API Documentation</h2>
            </div>

            <div className="ApiDocsAccordion">
              {apiSections.map((section) => (
                <details key={section.title} className="ProjectPanel ApiDocsSection">
                  <summary className="ApiDocsSummary">
                    <span>{section.title}</span>
                  </summary>

                  <div className="ApiDocsBody">
                    {section.entries.map((entry) => (
                      <article key={entry.name} className="ApiDocsEntry">
                        <h3>{entry.name}</h3>

                        {"summary" in entry && entry.summary ? (
                          <p className="ApiDocsEntrySummary">{entry.summary}</p>
                        ) : null}

                        {"signatures" in entry && entry.signatures ? (
                          <div className="ApiDocsSignatures">
                            {entry.signatures.map((signature) => (
                              <code key={signature} className="DocsReferenceSignature ApiDocsSignature">
                                {renderLinkedSignature(signature)}
                              </code>
                            ))}
                          </div>
                        ) : null}

                        {"items" in entry && entry.items ? (
                          <ul className="DocsReferenceList ApiDocsList">
                            {entry.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>

          

          <section id="rast-changelog" className="DocsReferenceSection">
            <div className="SectionHeadingRow">
              <h2 className="ProjectSectionTitle">Revision history</h2>
            </div>

            <article className="ProjectPanel DocsReferenceTable">
              <div className="DocsReferenceRow">
                <div className="DocsReferenceKey">v0.1</div>
                <div className="DocsReferenceValue">
                  Initial release.
                </div>
              </div>
              <div className="DocsReferenceRow">
                <div className="DocsReferenceKey">v0.2</div>
                <div className="DocsReferenceValue">
                  Fixed a critical memory leak pertaining to user input.
                </div>
              </div>

               <div className="DocsReferenceRow">
                <div className="DocsReferenceKey">v1.0</div>
                <div className="DocsReferenceValue">
                  Began Roffinity.
                </div>
              </div>
            </article>
          </section>

          <section className="ProjectFooterAction">
            <Link
              to="/home"
              className="ProjectAction AnimatedTextContainer"
              onClick={(event) => {
                event.preventDefault();
                navigateWithViewTransition(
                  navigate,
                  "/home",
                  getOppositeDirection(projectDirections["/RastProject"])
                );
              }}
            >
              <AnimatedActionLabel label="Back to Projects" />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
