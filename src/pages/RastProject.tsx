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

function renderMethodSummary(summary: string) {
  const italicNotePattern = /\*([^*]+)\*/g;
  const normalized = summary.replace(
    /(Requires[^.]*\.)/g,
    "__BOLD__$1__/BOLD__"
  ).replace(
    /(Applies[^.]*\.)/g,
    "__BOLD__$1__/BOLD__"
  ).replace(
    /(Optional[^.]*\.)/g,
    "__ITALIC__$1__/ITALIC__"
  ).replace(
    /(optionally[^.]*\.)/g,
    "__ITALIC__$1__/ITALIC__"
  );

  const segments = normalized.split(/(__BOLD__.*?__\/BOLD__|__ITALIC__.*?__\/ITALIC__)/g);

  return segments.map((segment, index) => {
    if (!segment) return null;

    if (segment.startsWith("__BOLD__") && segment.endsWith("__/BOLD__")) {
      const text = segment.slice("__BOLD__".length, -"__/BOLD__".length);
      return <strong key={`bold-${index}`}>{text}</strong>;
    }

    if (segment.startsWith("__ITALIC__") && segment.endsWith("__/ITALIC__")) {
      const text = segment.slice("__ITALIC__".length, -"__/ITALIC__".length);
      return <em key={`italic-${index}`}>{text}</em>;
    }

    const pieces: React.ReactNode[] = [];
    let lastIndex = 0;
    let matchIndex = 0;

    segment.replace(italicNotePattern, (match, inner, offset) => {
      if (offset > lastIndex) {
        pieces.push(
          <span key={`text-${index}-${matchIndex}`}>
            {segment.slice(lastIndex, offset)}
          </span>
        );
      }

      pieces.push(<em key={`note-${index}-${matchIndex}`}>{inner}</em>);
      lastIndex = offset + match.length;
      matchIndex += 1;
      return match;
    });

    if (lastIndex < segment.length) {
      pieces.push(
        <span key={`text-tail-${index}`}>{segment.slice(lastIndex)}</span>
      );
    }

    return <span key={`segment-${index}`}>{pieces}</span>;
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

const methodEntries = [
  {
    name: "Round()",
    signature: "Round(CurrentCanvas: canvas, Point: vector2, Thickness: number, Color: color3, Alpha: number): ()",
    summary: "Stamps a perfectly round pixel area at the given point, at its given thickness, color blended."
  },
  {
    name: "Square()",
    signature: "Square(CurrentCanvas: canvas, Point: vector2, Size: number, Color: color3, Alpha: number): ()",
    summary: "Stamps a perfectly square pixel area at the given point, at its given size, color blended. *Ridges do not auto-line up when drawing*"
  },
  {
    name: "Flat()",
    signature: "Flat(CurrentCanvas: canvas, Point: vector2, Rx: number, Ry: number, Color: color3, Alpha: number): ()",
    summary: "Stamps a flat, ellipse-like pixel area at the given point, at its given size, color blended. Requires two radii."
  },
  {
    name: "Glow()",
    signature: "Glow(CurrentCanvas: canvas, Point: vector2, Thickness: number, Color: color3): ()",
    summary: "Stamps a glow effect via alpha gradient around Point, thickness controls the radius of the glow, color controls the color of the glow at its core. Currently cannot blend color."
  },
  {
    name: "Blend()",
    signature: "Blend(CurrentCanvas: canvas, Point: vector2, Thickness: number, Strength: number, Color: color3?, Alpha: number?): ()",
    summary: "Blends the RGBA of existing pixels within the thickness of the brush area relative to the point. Optional color and alpha parameters to bias the blend towards a specific color or opacity."
  },
  {
    name: "Smudge()",
    signature: "Smudge(CurrentCanvas: canvas, StartPoint: vector2, Thickness: number): ()",
    summary: "Creates a thumb smudge effect by sampling pixels at starting point, then blending them along the direction of the users current stroke. Thickness controls the radius of the smudge area, strength is controlled by input speed."
  },
  {
    name: "Darken()",
    signature: "Darken(CurrentCanvas: canvas, Point: vector2, Thickness: number, Color: color3?, Alpha: number?): ()",
    summary: "Darkens the pixels within the specified area towards RGB(0,0,0), optionally biased by a color and alpha to control the strength and color of the darkening effect (subtle)."
  },
  {
    name: "Lighten()",
    signature: "Lighten(CurrentCanvas: canvas, Point: vector2, Thickness: number, Color: color3?, Alpha: number?): ()",
    summary: "Lightens the pixels within the specified area towards RGB(255,255,255), optionally biased by a color and alpha to control the strength and color of the lightening effect (subtle)."
  },
  {
    name: "Eraser()",
    signature: "Eraser(CurrentCanvas: canvas, Point: vector2, Thickness: number, Opacity: number?): ()",
    summary: "Erases the pixels within the specified area, creating a transparent effect. Thickness controls the radius of the erasing area. Applies the Round brush shape."
  },
  {
    name: "Ignore()",
    signature: "Ignore(CurrentCanvas: canvas, Point: vector2): ()",
    summary: "Ignores the pixels within the specified area, leaving them unchanged. On continous strokes, it creates an effect where the brush appears to go below pixels that arent clear. Applies current brush parameters (Thickness, Color, Alpha)."
  }
  
  
];

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
          <p className="ProjectEyebrow">Reference / Rendering Class</p>
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
          <div className="ProjectPanel DocsSidebarCard">
            <p className="ProjectEyebrow">On This Page</p>
          </div>

          <div className="ProjectPanel DocsSidebarCard DocsReferenceStatusCard">
            <p className="ProjectEyebrow">Project Facts</p>
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
              <p className="ProjectEyebrow">Summary</p>
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
              <p className="ProjectEyebrow">Members Index</p>
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
              <p className="ProjectEyebrow">Services</p>
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
              <p className="ProjectEyebrow">Methods</p>
            </div>

            <div className="DocsReferenceEntries">
              {methodEntries.map((entry) => (
                <article key={entry.name} className="ProjectPanel DocsReferenceTable">
                  <div className="DocsReferenceEntryHeader">
                    <h3>{entry.name}</h3>
                  </div>
                  <code className="DocsReferenceSignature">
                    {renderLinkedSignature(entry.signature)}
                  </code>
                  <p>{renderMethodSummary(entry.summary)}</p>
                </article>
              ))}
            </div>
          </section>

          

          <section id="rast-changelog" className="DocsReferenceSection">
            <div className="SectionHeadingRow">
              <p className="ProjectEyebrow">Changelog</p>
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
