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
    title: "SvelteKit + TypeScript",
    description: (
      <>
        <KeywordUnderline>SvelteKit</KeywordUnderline> handles routing and server
        boundaries. <KeywordWeight>TypeScript</KeywordWeight> defines the chart model
        shared by editor commands, persistence, and rendering.
      </>
    ),
    resourceUrl: "https://svelte.dev/docs/kit"
  },
  {
    title: "Object editor engine",
    description: (
      <>
        Sheets contain sections, lyric lines, and positioned chord nodes.{" "}
        <KeywordTypewriter>Pure commands</KeywordTypewriter> add, move, delete,
        transpose, mirror, fork, and publish them.
      </>
    )
  },
  {
    title: "Konva canvas",
    description: (
      <>
        <KeywordFade>Konva and svelte-konva</KeywordFade> provide the editor canvas
        for direct chord-node placement without coupling document operations to it.
      </>
    )
  },
  {
    title: "Supabase + Drizzle",
    description: (
      <>
        <KeywordUnderline>Supabase</KeywordUnderline> supplies authentication,
        Postgres, and storage. <KeywordWeight>Drizzle</KeywordWeight> owns the schema
        and server-side data access.
      </>
    )
  }
];

const workflowSteps = [
  {
    title: "Compose",
    description: (
      <>
        Create sections, paste lyric lines, then{" "}
        <KeywordUnderline>place chord nodes</KeywordUnderline> by click or drag.
      </>
    )
  },
  {
    title: "Revise",
    description: (
      <>
        Move chords, <KeywordTypewriter>transpose</KeywordTypewriter> the sheet, and
        mirror repeated sections from one source.
      </>
    )
  },
  {
    title: "Save and share",
    description: (
      <>
        Cache drafts in <KeywordFade>IndexedDB</KeywordFade>, sync private cloud drafts
        by revision, then <KeywordWeight>publish or fork</KeywordWeight> the chart.
      </>
    )
  }
];

const heroTechColumns = {
  left: [
    { label: "SvelteKit", logo: "/Svelte.svg" },
    { label: "SCSS", logo: "/SCSS.svg" },
    { label: "PostgreSQL", logo: "/PostgreSQL.svg" }
  ],
  right: [
    { label: "TypeScript", logo: "/TypeScript.png" },
    { label: "Supabase", logo: "/Supabase.svg" },
    { label: "Drizzle", logo: "/Drizzle.svg" }
  ],
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

      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTimeline.to(".ProjectHeroCopy > *", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12
      });

      gsap.utils.toArray<HTMLElement>(".ProjectSection").forEach((section, index, sections) => {
        if (index === sections.length - 1) return;
        gsap.to(section, {
          y: -10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

      gsap.set(".AccentKeywordFade", { opacity: 0.25, filter: "blur(4px)" });
      gsap.set(".AccentKeywordWeight", { fontWeight: 400, letterSpacing: "0.12em" });
      gsap.set(".AccentKeywordUnderlineLine", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".AccentKeywordBoxInner", { clipPath: "inset(0 100% 0 0)", opacity: 0.35 });

      gsap.utils.toArray<HTMLElement>(".ProjectSection, .ProjectHeroCopy").forEach((scope) => {
        const trigger = { trigger: scope, start: "top 85%", end: "bottom 75%", scrub: true };
        const fadeKeywords = scope.querySelectorAll<HTMLElement>(".AccentKeywordFade");
        const weightKeywords = scope.querySelectorAll<HTMLElement>(".AccentKeywordWeight");
        const underlineKeywords = scope.querySelectorAll<HTMLElement>(".AccentKeywordUnderlineLine");
        const boxKeywords = scope.querySelectorAll<HTMLElement>(".AccentKeywordBoxInner");

        if (fadeKeywords.length) {
          gsap.to(fadeKeywords, { opacity: 1, filter: "blur(0px)", stagger: 0.18, ease: "none", scrollTrigger: trigger });
        }
        if (weightKeywords.length) {
          gsap.to(weightKeywords, { fontWeight: 800, letterSpacing: "0.02em", stagger: 0.2, ease: "none", scrollTrigger: trigger });
        }
        if (underlineKeywords.length) {
          gsap.to(underlineKeywords, { scaleX: 1, stagger: 0.22, ease: "none", scrollTrigger: trigger });
        }
        if (boxKeywords.length) {
          gsap.to(boxKeywords, { clipPath: "inset(0 0% 0 0)", opacity: 1, stagger: 0.24, ease: "none", scrollTrigger: trigger });
        }
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
            chordwright is a <KeywordFade>browser-based</KeywordFade> chord-sheet
            editor built around <KeywordTypewriter>structured harmony</KeywordTypewriter>.
            Musicians can <KeywordUnderline>place chords over lyrics</KeywordUnderline>,
            mirror sections, transpose sheets, and <KeywordWeight>publish or fork</KeywordWeight>{" "}
            finished charts.
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
              Chords keep their harmonic value and{" "}
              <KeywordUnderline>canvas position</KeywordUnderline> as{" "}
              <KeywordWeight>editable data</KeywordWeight>, not aligned whitespace.
            </p>
          </article>

          <article className="ProjectPanel">
            <p>
              Editor commands operate on plain objects before Konva renders them.
              That separation keeps <KeywordTypewriter>drag behavior</KeywordTypewriter>,
              section mirroring, transposition, and <KeywordFade>persistence</KeywordFade>{" "}
              testable outside the canvas.
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
