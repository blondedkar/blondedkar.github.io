import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
import { useNavigate } from "react-router-dom";
import "../style.css";

gsap.registerPlugin(SplitText);

export default function Landing() {
  const navigate = useNavigate();

  const LandingRef = useRef<HTMLDivElement>(null);
  const TriangleRef = useRef<SVGPathElement>(null);
  const CircleRef = useRef<SVGCircleElement>(null);
  const LogoContainerRef = useRef<HTMLDivElement>(null);
  const LogoGroupRef = useRef<SVGGElement>(null);

  const BlondeRef = useRef<HTMLSpanElement>(null);
  const InteractiveRef = useRef<HTMLSpanElement>(null);

  const PlayTransition = async () => {
    return new Promise<void>((resolve) => {
      if (!TriangleRef.current || !CircleRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => resolve()
      });
      
      
      tl.to(LogoContainerRef.current, {
        scale: 12,
        transformOrigin: "center center",
        duration: 0.7,
        ease: "power4.inOut"
      });

      tl.to(LogoGroupRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut"
      }, "+= 0.4");

      tl.to(LandingRef.current, {
        background: "radial-gradient(circle at center, #c2c9c9a6, #87a5a871)",
        duration: 0.8
      });
    });
  }

  useEffect(() => {
    if (
      !TriangleRef.current ||
      !CircleRef.current ||
      !LandingRef.current ||
      !BlondeRef.current ||
      !InteractiveRef.current ||
      !LogoContainerRef.current
    ) return;

    const path = TriangleRef.current;
    const circle = CircleRef.current;
    const blonde = BlondeRef.current;
    const interactive = InteractiveRef.current;

    const length = path.getTotalLength();

    const splitBlonde = new SplitText(blonde, { type: "chars" });
    const splitInteractive = new SplitText(interactive, { type: "chars" });

    const allChars = [...splitBlonde.chars, ...splitInteractive.chars];

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      fill: "transparent",
      opacity: 0
    });

    gsap.set(circle, {
      scale: 0,
      opacity: 0,
      transformOrigin: "center"
    });

    gsap.set(allChars, {
      display: "inline-block",
      y: 60,
      opacity: 0,
      rotation: 4,
      scale: 0.95,
      filter: "blur(8px)"
    });

    const tl = gsap.timeline({
      onComplete: () => {
        PlayTransition().then(() => {
           navigate("/home");
        });
      }
    });

    
    tl.to(LandingRef.current, {
      backgroundColor: "#e9e9e9",
      duration: 1.5,
      ease: "power2.out"
    });

    tl.to(path, { opacity: 1, duration: 0.4 });

    tl.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "sine.inOut"
    });

    tl.to(path, {
      fill: "#c5efe4",
      stroke: "#c5efe4",
      duration: 0.8,
      ease: "sine.inOut"
    });

    tl.to(circle, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power3.out"
    });

    tl.to(splitBlonde.chars, {
      y: 0,
      opacity: 1,
      rotation: 0,
      scale: 1,
      filter: "blur(0px)",
      stagger: 0.035,
      duration: 0.5,
      ease: "power4.out"
    });

    tl.to(splitInteractive.chars, {
      y: 0,
      opacity: 1,
      rotation: 0,
      scale: 1,
      filter: "blur(0px)",
      stagger: 0.035,
      duration: 0.5,
      ease: "power4.out"
    }, "-=0.4");

    tl.to({}, { duration: 0.6 });

    tl.to(allChars, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      stagger: 0.01
    });

    tl.to(allChars, {
      opacity: 1,
      visibility: "hidden",
    }, "-=0.3");

    tl.call(() => {
      const group = LogoGroupRef.current;
      if (!group) return;

      const bbox = group.getBBox();

      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;

      gsap.to(group, {
        x: 130 - centerX,
        y: 130 - centerY,
        duration: 0.4,
        ease: "power2.inOut"
      });
    }, undefined, "-=0.3");

    /*
    tl.to(LogoContainerRef.current, {
      scale: 0.185,
      x: -window.innerWidth / 2 + 100 - 30,
      y: -window.innerHeight / 2 + 60,
      duration: 1,
      ease: "power3.inOut",
      zIndex: 99
    });*/

    return () => {
      splitBlonde.revert();
      splitInteractive.revert();
      tl.kill();
    };
  });

  return (
    <div
      ref={LandingRef}
      className="LandingWrapper"
    >
      {/* logo */}
      <div
        ref={LogoContainerRef}
        className="absolute flex flex-col items-center justify-center"
      >
        <svg width="460" height="350" viewBox="0 0 260 260">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g ref= {LogoGroupRef}>
          <path
            ref={TriangleRef}
            d="M100 20 L180 160 L20 160 Z"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          <circle
            ref={CircleRef}
            cx="180"
            cy="90"
            r="70"
            fill="#6eabb1"
          />
          </g>
        </svg>
        
        <h1 className="LandingTitle">
          <span ref={BlondeRef} className="WordBlonde">
            blonde
          </span>
          <span ref={InteractiveRef} className="WordInteractive">
            Interactive
          </span>
        </h1>
      </div>
    </div>
  );
}