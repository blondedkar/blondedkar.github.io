import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HighlightedCode from "./HighlightedCode";
import {
  consumePendingScrollTarget,
  getOppositeDirection,
  navigateWithViewTransition,
  projectDirections,
  resetPageScroll,
} from "../utils/viewTransitions";
import "../substyle.css";
import "../styles/map-guide.css";

gsap.registerPlugin(ScrollTrigger);

export function GuideInk({ children }: { children: ReactNode }) {
  return <span className="MapGuideInk">{children}</span>;
}

export function GuideCodeSample({ title, code, language = "TypeScript" }: {
  title: string; code: string; language?: string;
}) {
  const [status, setStatus] = useState("Copy code");
  const preRef = useRef<HTMLPreElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  async function copy() {
    window.clearTimeout(timerRef.current);
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied");
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      if (preRef.current && selection) {
        range.selectNodeContents(preRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("Use Ctrl/Cmd+C");
    }
    timerRef.current = window.setTimeout(() => setStatus("Copy code"), 2200);
  }

  return (
    <div className="MapGuideCode">
      <div className="MapGuideCodeBar">
        <span>{title}</span><span className="MapGuideCodeLanguage">{language}</span>
        <button type="button" onClick={copy} aria-label={"Copy " + title}>
          <span aria-live="polite">{status}</span>
        </button>
      </div>
      <pre ref={preRef} tabIndex={0} aria-label={title} data-lenis-prevent>
        <HighlightedCode code={code} language={language} />
      </pre>
    </div>
  );
}

export function GuideSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="MapGuideSection" aria-labelledby={id + "-title"} tabIndex={-1}>
      <h2 id={id + "-title"}>{title}</h2>{children}
    </section>
  );
}

function AnimatedActionLabel({ label }: { label: string }) {
  return (
    <>
      <span className="hidden" aria-hidden="true">{label}</span>
      <span className="top" aria-hidden="true">
        {[...label].map((letter, index) => (
          <span key={index} className="topLetter" style={{ transitionDelay: index * 0.02 + "s" }}>
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </span>
      <span className="bottom" aria-hidden="true">
        {[...label].map((letter, index) => (
          <span key={index} className="bottomLetter" style={{ transitionDelay: index * 0.02 + "s" }}>
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </span>
    </>
  );
}

type GuideIndexEntry = { id: string; title: string };

export default function ProjectGuide({ title, lead, projectPath, sections, articleLabel, children }: {
  title: ReactNode;
  lead: string;
  projectPath: string;
  sections: readonly GuideIndexEntry[];
  articleLabel: string;
  children: ReactNode;
}) {
  const pageRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useLayoutEffect(() => {
    const pending = consumePendingScrollTarget();
    const targetId = pending ?? window.location.hash.slice(1);
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      resetPageScroll(target ? target.getBoundingClientRect().top + window.scrollY - 120 : 0);
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [projectPath]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: "-15% 0px -60% 0px" });
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".MapGuideInk").forEach(word => {
          gsap.fromTo(word, { "--ink-progress": 0 }, {
            "--ink-progress": 1, ease: "none",
            scrollTrigger: { trigger: word.closest("section"), start: "top 80%", end: "bottom 65%", scrub: true },
          });
        });
      }, pageRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  function jumpTo(id: string) {
    const section = document.getElementById(id);
    if (!section) return;
    resetPageScroll(section.getBoundingClientRect().top + window.scrollY - 120);
    section.focus({ preventScroll: true });
    setActiveSection(id);
    window.history.replaceState(window.history.state, "", "#" + id);
  }

  return (
    <main ref={pageRef} className="ProjectPage MapGuidePage">
      <header id="project-hero" className="MapGuideHero">
        <div className="GuideBackRow">
          <Link to="/home" className="ProjectAction AnimatedTextContainer" aria-label="Back to Projects"
            onClick={event => {
              event.preventDefault();
              navigateWithViewTransition(navigate, "/home", getOppositeDirection(projectDirections[projectPath]));
            }}>
            <AnimatedActionLabel label="Back to Projects" />
          </Link>
        </div>
        <h1>{title}</h1>
        <p className="ProjectLead">{lead}</p>
        <div className="ProjectActionRow">
          <a className="ProjectAction" href="#initial-setup" onClick={event => {
            event.preventDefault(); jumpTo("initial-setup");
          }}>Start the setup <span aria-hidden="true">↗</span></a>
        </div>
      </header>
      <div className="MapGuideLayout">
        <aside className="MapGuideContents">
          <h2>On this page</h2>
          <nav aria-label="Guide sections">
            {sections.map(section => (
              <a key={section.id} href={"#" + section.id}
                aria-current={activeSection === section.id ? "location" : undefined}
                onClick={event => { event.preventDefault(); jumpTo(section.id); }}>{section.title}</a>
            ))}
          </nav>
        </aside>
        <article className="MapGuideArticle" aria-label={articleLabel}>{children}</article>
      </div>
    </main>
  );
}
