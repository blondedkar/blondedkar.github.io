import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
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

function KeywordFade({ children }: { children: ReactNode }) {
  return (
    <span className="AccentKeyword AccentKeywordFade AccentKeywordInk">
      {children}
    </span>
  );
}

function KeywordWeight({ children }: { children: ReactNode }) {
  return (
    <span className="AccentKeyword AccentKeywordWeight AccentKeywordInk">
      {children}
    </span>
  );
}

function KeywordUnderline({ children }: { children: ReactNode }) {
  return (
    <span className="AccentKeyword AccentKeywordUnderline AccentKeywordInk">
      <span className="AccentKeywordUnderlineText">{children}</span>
      <span className="AccentKeywordUnderlineLine" aria-hidden="true" />
    </span>
  );
}

function KeywordTypewriter({ children }: { children: ReactNode }) {
  return (
    <span className="AccentKeyword AccentKeywordBox AccentKeywordInk">
      <span className="AccentKeywordBoxInner">{children}</span>
    </span>
  );
}

const implementationAreas = [
  {
    title: "SvelteKit application shell",
    description: (
      <>
        SvelteKit supplies the route and rendering model for the public landing
        page, chart library, account flow, editor, and chart viewer. That keeps
        navigation and authenticated authoring inside one application boundary.
      </>
    ),
    resourceUrl: "https://svelte.dev/docs/kit"
  },
  {
    title: "Structured chart state",
    description: (
      <>
        A chart is stored as <KeywordTypewriter>musical structure</KeywordTypewriter>,
        not as a block of spaced text. Key, tempo, chord style, sections, chord
        positions, lyrics, and layout settings remain independently editable.
      </>
    )
  },
  {
    title: "Editor command surface",
    description: (
      <>
        Chord selection, click placement, drag-and-drop movement, section
        controls, and layout changes all operate on the same chart state. The
        rendered chart therefore remains a direct view of the current document.
      </>
    )
  },
  {
    title: "Publication boundary",
    description: (
      <>
        Authoring is attached to an authenticated account, while browsing and
        viewing use a separate public surface. The separation keeps editor
        controls out of the reading path without maintaining a second chart format.
      </>
    )
  }
];

const workflowSteps = [
  {
    title: "Establish chart context",
    description: (
      <>
        The document starts with its key, tempo, chord style, and layout. These
        values establish the constraints used by the editor before individual
        sections and chords are placed.
      </>
    )
  },
  {
    title: "Author the arrangement",
    description: (
      <>
        Sections provide the structural frame. Chords are inserted or moved
        within that frame, while the lyric panel keeps the song text visible as
        the harmonic sequence is revised.
      </>
    )
  },
  {
    title: "Publish the chart",
    description: (
      <>
        Saved chart data is rendered through the library and viewer rather than
        flattened into an editor screenshot. The published result stays readable,
        shareable, and independent of the authoring controls.
      </>
    )
  }
];

const heroTechColumns = {
  left: [
    { label: "SvelteKit", logo: "/Svelte.svg" },
    { label: "HTML", logo: "/HTML.png" }
  ],
  right: [{ label: "CSS", logo: "/CSS.png" }]
};

function AnimatedActionLabel({ label }: { label: string }) {
  return (
    <>
      <span className="hidden" aria-hidden="true">
        {label}
      </span>

      <span className="top" aria-hidden="true">
        {[...label].map((letter, index) => (
          <span
            key={"top-" + label + "-" + index}
            className="topLetter"
            style={{ transitionDelay: String(index * 0.02) + "s" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </span>

      <span className="bottom" aria-hidden="true">
        {[...label].map((letter, index) => (
          <span
            key={"bottom-" + label + "-" + index}
            className="bottomLetter"
            style={{ transitionDelay: String(index * 0.02) + "s" }}
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
          key={label + "-" + index}
          className="ResourcePromptChar"
          style={{ transitionDelay: String(index * 0.025) + "s" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

export default function ChordWrightProject() {
  const heroRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const pendingTarget = consumePendingScrollTarget();
    const target: number | HTMLElement =
      !pendingTarget || pendingTarget === "project-hero"
        ? 0
        : (document.getElementById(pendingTarget) ?? 0);

    const alignToTarget = () => {
      resetPageScroll(target);
    };

    alignToTarget();

    const frameId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      alignToTarget();
    });

    const timeoutId = window.setTimeout(() => {
      ScrollTrigger.refresh();
      alignToTarget();
    }, 120);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".TechColumnLeft",
        { yPercent: 0 },
        {
          yPercent: -16,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
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
          yPercent: 16,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }, heroRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;

    const context = gsap.context(() => {
      gsap.set(".ProjectHeroCopy > *", {
        opacity: 0,
        y: 36
      });

      gsap.set(".TechBadgeCard", {
        opacity: 0,
        y: 42,
        rotate: gsap.utils.wrap([-5, 4, -3])
      });

      const heroTimeline = gsap.timeline({ delay: 0.12 });

      heroTimeline.to(".ProjectHeroCopy > *", {
        opacity: 1,
        y: 0,
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.09
      });

      heroTimeline.to(
        ".TechBadgeCard",
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.08
        },
        0.12
      );

      gsap.utils.toArray<HTMLElement>(".ProjectSection").forEach((section) => {
        gsap.fromTo(
          section,
          { y: 68, rotateX: 6 },
          {
            y: 0,
            rotateX: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 84%"
            }
          }
        );
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <main ref={pageRef} className="ProjectPage">
      <section id="project-hero" ref={heroRef} className="ProjectHero">
        <div className="ProjectHeroCopy">
          <h1 className="SiteTitle">chordwright</h1>
          <p className="ProjectLead">
            chordwright is a browser-based editor for authoring, arranging, and
            publishing chord charts. It treats{" "}
            <KeywordTypewriter>song metadata</KeywordTypewriter>,{" "}
            <KeywordUnderline>section structure</KeywordUnderline>, chord placement,
            lyrics, and layout as structured editor state instead of one formatted
            text block.
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
                  getOppositeDirection(projectDirections["/ChordWrightProject"])
                );
              }}
            >
              <AnimatedActionLabel label="Back to Projects" />
            </Link>
            <a
              href="https://www.chordwright.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ProjectAction AnimatedTextContainer"
            >
              <AnimatedActionLabel label="Open ChordWright" />
            </a>
          </div>
        </div>

        <div className="ProjectHeroVisual">
          <div className="TechColumn TechColumnLeft">
            {heroTechColumns.left.map((item) => (
              <article key={item.label} className="TechBadgeCard">
                <div className="TechBadgeMark">{item.label}</div>
                <div className="TechLogoPlaceholder">
                  <img
                    src={item.logo}
                    alt={item.label + " logo"}
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
                    alt={item.label + " logo"}
                    className="TechLogoImage"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ProjectSection">
        <div className="SectionHeadingRow">
          <h2 className="ProjectSectionTitle">The document model</h2>
        </div>

        <div className="ProjectOverviewGrid">
          <article className="ProjectPanel">
            <p>
              Plain-text chord sheets carry layout in whitespace. Editing a symbol
              can shift everything that follows it, and the same content becomes
              difficult to reflow for another screen size. chordwright keeps the
              musical data <KeywordWeight>separate from presentation</KeywordWeight>{" "}
              so the chart can be edited without rewriting its visual alignment.
            </p>
          </article>

          <article className="ProjectPanel">
            <p>
              The editor still has to read like a chart while it is being assembled.
              Key, tempo, chord style, section boundaries, chord positions, and lyrics
              remain in the same working context, which reduces the distance between
              an edit and its <KeywordFade>rendered consequence</KeywordFade>.
            </p>
          </article>
        </div>
      </section>

      <section className="ProjectSection">
        <div className="SectionHeadingRow">
          <h2 className="ProjectSectionTitle">Implementation boundaries</h2>
        </div>

        <div className="ProjectCardGrid">
          {implementationAreas.map((area, index) =>
            area.resourceUrl ? (
              <a
                key={index}
                href={area.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ProjectPanel StackCard ResourceCard"
              >
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <SplitPromptLabel label="Read Documentation" />
              </a>
            ) : (
              <article key={index} className="ProjectPanel StackCard">
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            )
          )}
        </div>
      </section>

      <section className="ProjectSection">
        <div className="SectionHeadingRow">
          <h2 className="ProjectSectionTitle">Chart lifecycle</h2>
        </div>

        <div className="BuildTimeline">
          {workflowSteps.map((step, index) => (
            <article key={index} className="ProjectPanel TimelineCard">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
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
              getOppositeDirection(projectDirections["/ChordWrightProject"])
            );
          }}
        >
          <AnimatedActionLabel label="Back to Projects" />
        </Link>
      </section>
    </main>
  );
}
