import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "../style.css"

function MainWebsite() { 
  return (
    <div className="w-screen h-screen bg-[#6eabb1] flex flex-col items-center justify-center">
      <h2 className="text-3xl text-black">Main Website</h2>
     {/* my take on the lando norris text effect thingamabob go visit his site its dope */}
      <div className="text"> 
        <a href="/">
          {/* blonde */}
          <span className="logo-text">
            <span>b</span>
            <span>l</span>
            <span>o</span>
            <span>n</span>
            <span>d</span>
            <span>e</span>
            <span>&nbsp;</span>
          </span>

          {/* Interactive */}
          <span className="logo-text logo-text-thick">
            <span>I</span>
            <span>n</span>
            <span>t</span>
            <span>e</span>
            <span>r</span>
            <span>a</span>
            <span>c</span>
            <span>t</span>
            <span>i</span>
            <span>v</span>
            <span>e</span>
          </span>
        </a>
      </div>
    </div>
  );
}

export default function Landing() {
  const LandingRef = useRef<HTMLDivElement>(null);
  const LogoWrapperRef = useRef<HTMLDivElement>(null);
  const TriangleRef = useRef<SVGPathElement>(null);
  const CircleRef = useRef<SVGCircleElement>(null);
  const MaskRef = useRef<HTMLDivElement>(null);

  const [ShowMain, setShowMain] = useState(false);

  useEffect(() => {
    if (
      !TriangleRef.current ||
      !CircleRef.current ||
      !LandingRef.current ||
      !LogoWrapperRef.current
    ) return;

    const path = TriangleRef.current;
    const circle = CircleRef.current;
    const wrapper = LogoWrapperRef.current;

    const length = path.getTotalLength();

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

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => setShowMain(true), 1500);
      }
    });

    tl.to(LandingRef.current, {
      backgroundColor: "#e9e9e9",
      duration: 1.5,
      ease: "power2.out"
    });

    //triangle fade in :P
    tl.to(path, {
      opacity: 1,
      duration: 0.4
    });

    //outline triangle
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "sine.inOut"
    });

    //fill the triangle
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

    //alighn to middle
    tl.to(wrapper, {
      x: -40,
      duration: 1,
      ease: "power2.inOut"
    });

  }, []);

  //temporary mosue mask effect, will replace with something better later
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!MaskRef.current) return;

      const x = e.clientX;
      const y = e.clientY;

      MaskRef.current.style.webkitMaskImage = `
        radial-gradient(circle 200px at ${x}px ${y}px,
        transparent 0%,
        transparent 40%,
        black 41%)
      `;

      MaskRef.current.style.maskImage = `
        radial-gradient(circle 200px at ${x}px ${y}px,
        transparent 0%,
        transparent 40%,
        black 41%)
      `;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (ShowMain) {
    return <MainWebsite />;
  }

  return (
    <div
      ref={LandingRef}
      className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden relative"
    >
      {/* color Layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={LogoWrapperRef}>
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
          </svg>
        </div>
      </div>

     

      {/* greyscale mask */}
      <div
        ref={MaskRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "grayscale(100%)",
          WebkitBackdropFilter: "grayscale(100%)"
        }}
      />
    </div>
  );
}