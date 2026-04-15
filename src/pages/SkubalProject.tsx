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

const stackItems = [
  {
    title: "HTML",
    description: (
      <>
        A lot of the page structure started with straightforward{" "}
        <KeywordTypewriter>HTML semantics</KeywordTypewriter> so the project
        could stay easy to reason about before the heavier motion and layout
        work came in.
      </>
    ),
    resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML"
  },
  {
    title: "TypeScript",
    description: (
      <>
        <KeywordUnderline>TypeScript</KeywordUnderline> helped keep the
        components predictable while the layout, transitions, and UI sections
        expanded. It made iteration feel more{" "}
        <KeywordWeight>controlled</KeywordWeight> than loose JS would have.
      </>
    ),
    resourceUrl: "https://www.typescriptlang.org/"
  },
  {
    title: "Next.js",
    description: (
      <>
        <KeywordUnderline>Next.js</KeywordUnderline> was mainly used to expand{" "}
        my own <KeywordWeight>versatility</KeywordWeight> as a developer. It
        was less about solving one specific requirement and more about building
        familiarity with a framework I wanted to get more comfortable using.
      </>
    ),
    resourceUrl: "https://nextjs.org/"
  },
  {
    title: "GSAP",
    description: (
      <>
        The motion language leans on <KeywordUnderline>GSAP</KeywordUnderline>{" "}
        for scroll sequencing, reveals, and the kind of
        <KeywordFade>polished</KeywordFade> interaction that makes the page feel
        deliberate instead of static.
      </>
    ),
    resourceUrl: "https://gsap.com/"
  }
];

const buildSteps = [
  {
    eyebrow: "",
    title: "Layout First",
    description: (
      <>
        The first step was getting a clean page foundation in place so the
        project could communicate clearly before any of the more expressive
        visual treatment was layered on.
      </>
    )
  },
  {
    eyebrow: "",
    title: "Flexible Framework Choice",
    description: (
      <>
        <KeywordUnderline>Next.js</KeywordUnderline> was part of the project so
        I could broaden my own experience. The goal was not to answer one very
        specific technical need, but to make the build a chance to strengthen
        my comfort with another modern workflow.
      </>
    )
  },
  {
    eyebrow: "",
    title: "Motion and Presentation",
    description: (
      <>
        With the structure locked in, <KeywordUnderline>GSAP</KeywordUnderline>{" "}
        handled the presentation layer so the experience could feel more{" "}
        <KeywordWeight>alive</KeywordWeight> while still keeping the content
        readable.
      </>
    )
  }
];

const heroTechColumns = {
  left: [
    { label: "HTML", logo: "/HTML.png" },
    { label: "TS", logo: "/TypeScript.png" }
  ],
  right: [
    { label: "Next", logo: "/NextJS.webp" },
    { label: "GSAP", logo: "/GSAP.png" }
  ]
};

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

export default function SkubalProject() {
  const heroRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

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
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".TechColumnLeft",
        { yPercent: 0 },
        {
          yPercent: -18,
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
          yPercent: 18,
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

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".ProjectHeroCopy > *", {
        y: 28
      });

      gsap.set(".TechBadgeCard", {
        y: 40,
        rotate: gsap.utils.wrap([-6, 6, -4, 4])
      });

      const heroTimeline = gsap.timeline({ delay: 0.15 });

      heroTimeline.to(".ProjectHeroCopy > *", {
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08
      });

      heroTimeline.to(
        ".TechBadgeCard",
        {
          y: 0,
          rotate: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08
        },
        0.15
      );

      gsap.utils.toArray<HTMLElement>(".ProjectSection").forEach((section) => {
        gsap.fromTo(
          section,
          {
            y: 80,
            rotateX: 8
          },
          {
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%"
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".ProjectSection, .ProjectHeroCopy").forEach((scope) => {
        const cards = scope.querySelectorAll(".ProjectPanel");
        if (!cards.length) return;

        gsap.fromTo(
          cards,
          {
            y: 48
          },
          {
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: scope,
              start: "top 78%"
            }
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="ProjectPage">
      <section id="project-hero" ref={heroRef} className="ProjectHero">
        <div className="ProjectHeroCopy">
          <p className="ProjectEyebrow">Case Study / Portfolio Build</p>
          <h1 className="SiteTitle">Skubal Portfolio Project</h1>
          <p className="ProjectLead">
            This project is a <KeywordFade>portfolio-style</KeywordFade> build
            centered on clean presentation, flexible structure, and motion that
            gives the experience more <KeywordWeight>energy</KeywordWeight>{" "}
            without overwhelming the content.
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
                  getOppositeDirection(projectDirections["/SkubalProject"])
                );
              }}
            >
              <AnimatedActionLabel label="Back to Projects" />
            </Link>
            <a
              href="https://skuballin.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="ProjectAction AnimatedTextContainer"
            >
              <AnimatedActionLabel label="Visit Project" />
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

      <section className="ProjectSection">
        <div className="SectionHeadingRow">
          <p className="ProjectEyebrow">Overview</p>
          <h2 className="ProjectSectionTitle">What this project was trying to do</h2>
        </div>

        <div className="ProjectOverviewGrid">
          <article className="ProjectPanel">
            <p>
              The goal here was to build a project page that feels more{" "}
              <KeywordUnderline>intentional</KeywordUnderline> than a plain
              gallery or resume card. The layout gives the work room to explain
              itself while still feeling designed.
            </p>
          </article>

          <article className="ProjectPanel">
            <p>
              A big part of the approach was balancing{" "}
              <KeywordFade>clarity</KeywordFade> with presentation. The content
              needed to stay readable first, while the motion and framing added
              enough <KeywordTypewriter>personality</KeywordTypewriter> to make
              the page memorable.
            </p>
          </article>
        </div>
      </section>

      <section className="ProjectSection">
        <div className="SectionHeadingRow">
          <p className="ProjectEyebrow">Stack</p>
          <h2 className="ProjectSectionTitle">How it was built</h2>
        </div>

        <div className="ProjectCardGrid">
          {stackItems.map((item, index) =>
            item.resourceUrl ? (
              <a
                key={index}
                href={item.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ProjectPanel StackCard ResourceCard"
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <SplitPromptLabel label="Visit Resource" />
              </a>
            ) : (
              <article key={index} className="ProjectPanel StackCard">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )
          )}
        </div>
      </section>

      <section className="ProjectSection">
        <div className="SectionHeadingRow">
          <p className="ProjectEyebrow">Build Process</p>
          <h2 className="ProjectSectionTitle">From structure to polish</h2>
        </div>

        <div className="BuildTimeline">
          {buildSteps.map((step, index) => (
            <article key={index} className="ProjectPanel TimelineCard">
              <span className="TimelineIndex">{step.eyebrow}</span>
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
              getOppositeDirection(projectDirections["/SkubalProject"])
            );
          }}
        >
          <AnimatedActionLabel label="Back to Projects" />
        </Link>
      </section>
    </main>
  );
}
