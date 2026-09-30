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

function KeywordTypewriter({ children }: { children: ReactNode }) {
  return (
    <span className="AccentKeyword AccentKeywordBox AccentKeywordInk">
      <span className="AccentKeywordBoxInner">{children}</span>
    </span>
  );
}

const implementationAreas = [
  {
    title: "SvelteKit + TypeScript",
    description: (
      <>
        SvelteKit handles routing and server boundaries. TypeScript defines the
        chart model shared by editor commands, persistence, and rendering.
      </>
    ),
    resourceUrl: "https://svelte.dev/docs/kit"
  },
  {
    title: "Object editor engine",
    description: (
      <>
        Sheets contain sections, lyric lines, and positioned chord nodes. Pure
        commands add, move, delete, transpose, mirror, fork, and publish them.
      </>
    )
  },
  {
    title: "Konva canvas",
    description: (
      <>
        Konva and svelte-konva provide the editor canvas for direct chord-node
        placement without coupling document operations to the renderer.
      </>
    )
  },
  {
    title: "Supabase + Drizzle",
    description: (
      <>
        Supabase supplies authentication, Postgres, and storage. Drizzle owns the
        schema and server-side data access for charts, profiles, and social data.
      </>
    )
  }
];

const workflowSteps = [
  {
    title: "Compose",
    description: (
      <>
        Create sections, paste lyric lines, then place chord nodes by click or drag.
      </>
    )
  },
  {
    title: "Revise",
    description: (
      <>
        Move chords, transpose the sheet, and mirror repeated sections from one source.
      </>
    )
  },
  {
    title: "Save and share",
    description: (
      <>
        Cache drafts in IndexedDB, sync private cloud drafts by revision, then publish
        or fork a chart when it is ready.
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

export default function ChordwrightProject() {
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
          { autoAlpha: 0, y: 96, rotateX: 8 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              toggleActions: "play none none reverse"
            }
          }
        );

        const panels = section.querySelectorAll(".ProjectPanel");
        if (!panels.length) return;

        gsap.fromTo(
          panels,
          { autoAlpha: 0, y: 54 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 76%",
              toggleActions: "play none none reverse"
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
            chordwright is a browser-based chord-sheet editor built around{" "}
            <KeywordTypewriter>structured harmony</KeywordTypewriter>. Musicians can
            place chords over lyrics, mirror sections, transpose sheets, and publish
            or fork finished charts.
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
                  getOppositeDirection(projectDirections["/chordwright"])
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
              <AnimatedActionLabel label="Open chordwright" />
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
          <h2 className="ProjectSectionTitle">Structured harmony</h2>
        </div>

        <div className="ProjectOverviewGrid">
          <article className="ProjectPanel">
            <p>
              A sheet is a hierarchy of sections, lyric lines, and chord nodes.
              Chords keep their harmonic value and canvas position as{" "}
              <KeywordWeight>editable data</KeywordWeight>, not aligned whitespace.
            </p>
          </article>

          <article className="ProjectPanel">
            <p>
              Editor commands operate on plain objects before Konva renders them.
              That separation keeps drag behavior, section mirroring, transposition,
              and <KeywordFade>persistence</KeywordFade> testable outside the canvas.
            </p>
          </article>
        </div>
      </section>

      <section className="ProjectSection">
        <div className="SectionHeadingRow">
          <h2 className="ProjectSectionTitle">System boundaries</h2>
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
          <h2 className="ProjectSectionTitle">Editing workflow</h2>
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
              getOppositeDirection(projectDirections["/chordwright"])
            );
          }}
        >
          <AnimatedActionLabel label="Back to Projects" />
        </Link>
      </section>
    </main>
  );
}
