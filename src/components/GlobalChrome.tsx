import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "../style.css";
import { navigateWithViewTransition } from "../utils/viewTransitions";
import { usePerformanceMode } from "../hooks/usePerformanceMode";

const contactItems = [
  {
    label: "pedroramosm22@gmail.com",
    icon: "/gmail.svg",
    link: "mailto:pedroramosm22@gmail.com"
  },
  {
    label: "LinkedIn",
    icon: "/LinkedIn.svg",
    link: "https://www.linkedin.com/in/pedro-ramos-b74a10258/"
  },
  {
    label: "GitHub",
    icon: "/Github.svg",
    link: "https://github.com/blondedkar"
  }
];

export default function GlobalChrome() {
  const location = useLocation();
  const navigate = useNavigate();
  const topBarRef = useRef<HTMLDivElement>(null);
  const dividerWrapperRef = useRef<SVGSVGElement>(null);
  const dividerRef = useRef<SVGPathElement>(null);
  const dividerMaskRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const performanceMode = usePerformanceMode();
  const isReduced = performanceMode === "reduced";

  const hideChrome = location.pathname === "/landing";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (hideChrome || isReduced) return;

    const topBar = topBarRef.current;
    const svg = dividerWrapperRef.current;
    const path = dividerRef.current;
    const maskPath = dividerMaskRef.current;

    if (!topBar || !svg || !path || !maskPath) return;

    const baseY = 20.5;
    const maxHeight = 5;

    let targetX = 50;
    let targetH = 0;
    let currentX = 50;
    let currentH = 0;
    let rafId = 0;

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    const draw = () => {
      currentX += (targetX - currentX) * 0.35;
      currentH += (targetH - currentH) * 0.35;

      const x = currentX;
      const halfWidth = 4;
      const left = Math.max(x - halfWidth, 0);
      const right = Math.min(x + halfWidth, 100);
      const peakY = baseY - currentH;

      const d = `
        M 0 ${baseY}
        L ${left} ${baseY}
        C ${left + 2} ${baseY}
          ${x - 2} ${peakY}
          ${x} ${peakY}
        C ${x + 2} ${peakY}
          ${right - 2} ${baseY}
          ${right} ${baseY}
        L 100 ${baseY}
      `;

      path.setAttribute("d", d);
      maskPath.setAttribute("d", d);
      rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!rafId) rafId = requestAnimationFrame(draw);
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = topBar.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top;

      const xPercent = (relativeX / rect.width) * 100;
      targetX = clamp(xPercent, 0, 100);

      const fromBottom = rect.height - relativeY;
      targetH = clamp(fromBottom * 0.25, 0, maxHeight);
      start();
    };

    const handleMouseLeave = () => {
      targetH = 0;

      gsap.to({}, {
        duration: 0.5,
        onComplete: () => {
          stop();
          const resetPath = `M0 ${baseY} L100 ${baseY}`;
          path.setAttribute("d", resetPath);
          maskPath.setAttribute("d", resetPath);
        }
      });
    };

    topBar.addEventListener("mousemove", handleMouseMove);
    topBar.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      topBar.removeEventListener("mousemove", handleMouseMove);
      topBar.removeEventListener("mouseleave", handleMouseLeave);
      stop();
    };
  }, [hideChrome, isReduced]);

  useEffect(() => {
    if (hideChrome || !progressRef.current) return;

    const updateProgress = () => {
      const root = document.documentElement;
      const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 0);
      const progress = maxScroll === 0 ? 0 : window.scrollY / maxScroll;

      gsap.set(progressRef.current, {
        scaleX: Math.max(0, Math.min(progress, 1))
      });
    };

    updateProgress();

    const onScroll = () => updateProgress();
    const onResize = () => updateProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const timeoutId = window.setTimeout(updateProgress, 120);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timeoutId);
    };
  }, [hideChrome, location.pathname]);

  if (hideChrome) return null;

  return (
    <>
      <div className="ScrollProgressBar" ref={progressRef} />

      <nav>
        <button
          className="MenuButton"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle contact menu"
          aria-expanded={menuOpen}
        >
          <svg
            viewBox="0 0 310 259.34375"
            stroke="currentColor"
            strokeWidth="49"
            strokeLinecap="round"
            strokeLinejoin="miter"
            className="MenuIcon"
          >
            <path d="M 19.668179 229.66275 H 270.31428" />
            <path d="M 19.668179 129.66275 H 270.31428" />
            <path d="M 19.668179 29.66275 H 270.31428" />
          </svg>
        </button>

        <div
          ref={topBarRef}
          className={`TopBar ${menuOpen ? "Open" : ""} ${isReduced ? "ReducedMotion" : ""}`}
        >
          <div className="TopBarLogoContainer">
            <button
              id="MainNavLogo"
              className="Logo GlobalLogoButton"
              onClick={() => navigateWithViewTransition(navigate, "/home")}
              aria-label="Go to home"
            >
              <img src="/logo.svg" alt="Logo" />
            </button>
          </div>

          <ul className="TopBarContactContainer">
            {contactItems.map((item, index) => (
              <li className="ContactItem" key={item.label}>
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`ContactIcon ${item.label === "pedroramosm22@gmail.com" ? "gmail" : ""}`}
                />

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="AnimatedTextContainer ContactLink"
                >
                  <div className="top">
                    {[...item.label].map((letter, i) => (
                      <span
                        key={i}
                        className="topLetter"
                        style={{ transitionDelay: `${i * 0.02}s` }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    ))}
                  </div>

                  <div className="bottom">
                    {[...item.label].map((letter, i) => (
                      <span
                        key={i}
                        className="bottomLetter"
                        style={{ transitionDelay: `${i * 0.02}s` }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    ))}
                  </div>
                </a>

                {index < contactItems.length - 1 && <span className="ContactDivider" />}
              </li>
            ))}
          </ul>

          <div className="TopBarDividerWrapper">
            <svg className="TopBarMaskDefs" aria-hidden="true" focusable="false">
              <defs>
                <mask id="dividerMask" maskUnits="objectBoundingBox" maskContentUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="20" fill="white" />
                  <path
                    ref={dividerMaskRef}
                    d="M0 20.5 L100 20.5"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                </mask>
              </defs>
            </svg>

             <svg
              ref={dividerWrapperRef}
              className="TopBarDivider"
              preserveAspectRatio="none"
              viewBox="0 0 100 20"
            >
              <path
                ref={dividerRef}
                d="M0 20.5 L100 20.5"
                stroke="#87a5a8"
                strokeWidth="2"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>

        <div className={`MobileSidebar ${menuOpen ? "open" : ""}`}>
          <Link
            to="/home"
            onClick={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              navigateWithViewTransition(navigate, "/home");
            }}
          >
            Home
          </Link>
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
