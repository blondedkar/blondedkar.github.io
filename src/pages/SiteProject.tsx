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
    title: "Vite",
    description: (
      <>
        Using <KeywordTypewriter>Vite</KeywordTypewriter> for efficiency, we're pairing with
        <KeywordFade>TSX</KeywordFade> so the page structure stays{" "}
        <KeywordUnderline>organized</KeywordUnderline> and easy to expand.
      </>
    ),
    resourceUrl: "https://vite.dev/"
  },
  {
    title: "GSAP",
    description: (
      <>
        Most of the motion language comes from <KeywordUnderline>GSAP</KeywordUnderline>{" "}
        timelines, <KeywordWeight>ScrollTrigger</KeywordWeight> sequences, and
        split-text reveals that give the portfolio more{" "}
        <KeywordFade>personality</KeywordFade>.
      </>
    ),
    resourceUrl: "https://gsap.com/"
  },
  {
    title: "Custom CSS",
    description: (
      <>
        Instead of leaning on a template like tailwind, the visuals
        are shaped by <KeywordUnderline>typography</KeywordUnderline>,{" "}
        <KeywordWeight>spacing</KeywordWeight>, and my personal visual
        style.
      </>
    )
  },
  {
    title: "Lenis",
    description: (
      <>
        Lenis hi-jacks the default scrolling behavior with <KeywordUnderline> smooth </KeywordUnderline>
        interpolated scrolling and enables <KeywordWeight>beautiful </KeywordWeight> scrolling animations.
      </>
    ),
    resourceUrl: "https://lenis.darkroom.engineering/"
  }
];

const buildSteps = [
  {
    eyebrow: "",
    title: "Landing Experience",
    description: (
      <>
        The homepage opens with a path animation of my IP,{" "}
        <KeywordFade>blonde Interactive</KeywordFade>, which eases users into
        the scene and then hands off to the main site in a{" "}
        <KeywordWeight>smooth</KeywordWeight> way.
      </>
    )
  },
  {
    eyebrow: "",
    title: "Interactive Main Page",
    description: (
      <>
        The main portfolio page combines a dynamic fog background,
        scroll-linked transforms, and animated project folders to make
        navigation feel <KeywordUnderline>alive</KeywordUnderline>.
      </>
    )
  },
  {
    eyebrow: "",
    title: "Project Storytelling",
    description: (
      <>
        Each project page is meant to explain the{" "}
        <KeywordUnderline>why</KeywordUnderline> behind the work, not just show
        screenshot, so users can understand the design decisions with {" "}
        <KeywordFade>context</KeywordFade>.
      </>
    )
  }
];

const heroTechColumns = {
  left: [
    { label: "HTML", logo: "/HTML.png" },
    { label: "CSS", logo: "/CSS.png" },
    { label: "TS", logo: "/TypeScript.png" }
  ],
  right: [
    { label: "React", logo: "/React.png" },
    { label: "GSAP", logo: "/GSAP.png" },
    { label: "Vite", logo: "/Vite.png" }
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

export default function SiteProject() {
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
        opacity: 0,
        y: 48
      });

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out"
        }
      });

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

      gsap.set(".AccentKeywordFade", {
        opacity: 0.25,
        filter: "blur(4px)"
      });

      gsap.utils.toArray<HTMLElement>(".ProjectSection, .ProjectHeroCopy").forEach((scope) => {
        const fadeKeywords = scope.querySelectorAll<HTMLElement>(".AccentKeywordFade");
        if (fadeKeywords.length) {
          gsap.to(fadeKeywords, {
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.18,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top 85%",
              end: "bottom 75%",
              scrub: true
            }
          });
        }
      });

      gsap.set(".AccentKeywordWeight", {
        fontWeight: 400,
        letterSpacing: "0.12em"
      });

      gsap.utils.toArray<HTMLElement>(".ProjectSection, .ProjectHeroCopy").forEach((scope) => {
        const weightKeywords = scope.querySelectorAll<HTMLElement>(".AccentKeywordWeight");
        if (weightKeywords.length) {
          gsap.to(weightKeywords, {
            fontWeight: 800,
            letterSpacing: "0.02em",
            stagger: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top 85%",
              end: "bottom 75%",
              scrub: true
            }
          });
        }
      });

      gsap.set(".AccentKeywordUnderlineLine", {
        scaleX: 0,
        transformOrigin: "left center"
      });

      gsap.utils.toArray<HTMLElement>(".ProjectSection, .ProjectHeroCopy").forEach((scope) => {
        const underlineKeywords = scope.querySelectorAll<HTMLElement>(".AccentKeywordUnderlineLine");
        if (underlineKeywords.length) {
          gsap.to(underlineKeywords, {
            scaleX: 1,
            stagger: 0.22,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top 85%",
              end: "bottom 75%",
              scrub: true
            }
          });
        }
      });

      gsap.set(".AccentKeywordBoxInner", {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0.35
      });

      gsap.utils.toArray<HTMLElement>(".ProjectSection, .ProjectHeroCopy").forEach((scope) => {
        const boxKeywords = scope.querySelectorAll<HTMLElement>(".AccentKeywordBoxInner");
        if (boxKeywords.length) {
          gsap.to(boxKeywords, {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            stagger: 0.24,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top 85%",
              end: "bottom 75%",
              scrub: true
            }
          });
        }
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="ProjectPage">
      <section id="project-hero" ref={heroRef} className="ProjectHero">
        <div className="ProjectHeroCopy">
          <p className="ProjectEyebrow">Case Study / Portfolio Build</p>
          <h1 className="SiteTitle">This Website</h1>
          <p className="ProjectLead">
            This project is the portfolio site itself: a{" "}
            <KeywordFade>React-based</KeywordFade>{" "}
            personal site focused on{" "}
            <KeywordTypewriter>motion</KeywordTypewriter>,{" "}
            <KeywordUnderline>atmosphere</KeywordUnderline>,
            and giving each section a more{" "}
            <KeywordWeight>intentional</KeywordWeight>{" "}
            design than the standard portfolio.
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
                  getOppositeDirection(projectDirections["/SiteProject"])
                );
              }}
            >
              <AnimatedActionLabel label="Back to Projects" />
            </Link>
            <a
              href="https://github.com/blondedkar/blondedkar.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="ProjectAction AnimatedTextContainer"
            >
              <AnimatedActionLabel label="View Repository" />
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
          <h2 className="ProjectSectionTitle">What I wanted this site to do</h2>
        </div>

        <div className="ProjectOverviewGrid">
          <article className="ProjectPanel">
            <p>
              The goal was to avoid the usual portfolio pattern of a{" "}
              static hero followed by flat
              descriptor cards. This site uses{" "}
              <KeywordUnderline>staged motion</KeywordUnderline>{" "}
              and carefully paced scroll transitions to make the experience feel closer
              to a{" "}
              <KeywordWeight>designed site</KeywordWeight> than a resume page.
            </p>
          </article>

          <article className="ProjectPanel">
            <p>
              A big focus was balancing <KeywordFade>personality</KeywordFade>{" "}
              with clarity: the visuals needed to feel expressive yet not overblown, and the
              project sections still had to stay <KeywordUnderline>readable</KeywordUnderline>{" "}
              and well <KeywordTypewriter>responsive</KeywordTypewriter>.
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
          {stackItems.map((item, index) => (
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
          ))}
        </div>
      </section>

      <section className="ProjectSection">
        <div className="SectionHeadingRow">
          <p className="ProjectEyebrow">Build Process</p>
          <h2 className="ProjectSectionTitle">From intro animation to project grid</h2>
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
              getOppositeDirection(projectDirections["/SiteProject"])
            );
          }}
        >
          <AnimatedActionLabel label="Back to Projects" />
        </Link>
      </section>
    </main>
  );
}
