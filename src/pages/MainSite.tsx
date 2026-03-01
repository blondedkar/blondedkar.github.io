import { useEffect, useRef } from "react";
import React from "react";
import { gsap } from "gsap";
import "../style.css";
import { useScrollEvents } from "../hooks/useScrollEvents";
import { useState } from "react";

export default function MainWebsite() {
  //const Items = ["blonde Interactive"];
  const ContactItems = [
    {
      label: "pedroramosm22@gmail.com",
      icon: "/gmail.svg"
    },
    {
      label: "LinkedIn",
      icon: "/LinkedIn.svg"
    },
    {
     label: "GitHub",
     icon: "/Github.svg"
    }
  ];  

  const TopBarRef = useRef<HTMLDivElement>(null);
  const DividerWrapperRef = useRef<SVGSVGElement>(null);
  const DividerRef = useRef<SVGPathElement>(null);
  const HeroRef = useRef<HTMLHeadingElement>(null);
  const ScrollProgressRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  

  useEffect(() => {
  const topBar = TopBarRef.current;
  const svg = DividerWrapperRef.current;
  const path = DividerRef.current;

  if (!topBar || !svg || !path) return;

  const BaseY = 20.5;
  const MaxHeight = 5;

  let TargetX = 50;
  let TargetH = 0;

  let CurrentX = 50;
  let CurrentH = 0;

  let RafId = 0;

  const Clamp = (Value: number, Min: number, Max: number) =>
    Math.max(Min, Math.min(Max, Value));

  const Draw = () => {
  CurrentX += (TargetX - CurrentX) * 0.35;
  CurrentH += (TargetH - CurrentH) * 0.35;

  const x = CurrentX;

  const halfWidth = 4;
  const left = Math.max(x - halfWidth, 0);
  const right = Math.min(x + halfWidth, 100);

  const peakY = BaseY - CurrentH;
  
  /*quick mafs*/
  const d = ` 
    M 0 ${BaseY}
    L ${left} ${BaseY}
    C ${left + 2} ${BaseY}
      ${x - 2} ${peakY}
      ${x} ${peakY}
    C ${x + 2} ${peakY}
      ${right - 2} ${BaseY}
      ${right} ${BaseY}
    L 100 ${BaseY}
  `;

  path.setAttribute("d", d);

    RafId = requestAnimationFrame(Draw);
  };

  const Start = () => {
    if (!RafId) RafId = requestAnimationFrame(Draw);
  };

  const Stop = () => {
    if (RafId) cancelAnimationFrame(RafId);
    RafId = 0;
  };

  const HandleMouseMove = (e: MouseEvent) => {
    const rect = topBar.getBoundingClientRect();

    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    const xPercent = (relativeX / rect.width) * 100;
    TargetX = Clamp(xPercent, 0, 100);

    const fromBottom = rect.height - relativeY;
    const height = Clamp(fromBottom * 0.25, 0, MaxHeight);
    TargetH = height;

    Start();
  };

  const HandleMouseLeave = () => {
    TargetH = 0;

    gsap.to({}, {
      duration: 0.5,
      onComplete: () => {
        Stop();
        path.setAttribute("d", `M0 ${BaseY} L100 ${BaseY}`);
      }
    });
  };

  topBar.addEventListener("mousemove", HandleMouseMove);
  topBar.addEventListener("mouseleave", HandleMouseLeave);

  return () => {
    topBar.removeEventListener("mousemove", HandleMouseMove);
    topBar.removeEventListener("mouseleave", HandleMouseLeave);
    Stop();
    };
  }, 
[]);


  useEffect(() => {
    if (!TopBarRef.current) return;

    gsap.set(TopBarRef.current, {
      y: -80,
      opacity: 0
    });

    gsap.to(TopBarRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out"
    });

  }, []);


  useEffect(() => {
  if (!HeroRef.current) return;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ delay: 0.4 });

    const Pedro = HeroRef.current!.querySelector(".Highlight2");
    const Ramos = HeroRef.current!.querySelector(".Highlight4");
    const FullStack = HeroRef.current!.querySelectorAll(".Highlight")[0];
    const Developer = HeroRef.current!.querySelectorAll(".Highlight")[1];
    const Engineer = HeroRef.current!.querySelector(".Highlight3");
    const Technical = HeroRef.current!.querySelector(".Highlight5");
    const Writer = HeroRef.current!.querySelectorAll(".Highlight2")[1];

  
    gsap.set(HeroRef.current, {
      rotationX: 0,
      rotationY: 0,
      transformPerspective: 1400
    });

    gsap.set([Pedro, Ramos, FullStack, Developer, Engineer, Technical], {
      opacity: 0,
      z: -40
    });

    gsap.set(Pedro, { y: -20 });
    gsap.set(FullStack, { y: -25 });
    gsap.set(Developer, { y: 25 });
    gsap.set(Technical, { x: -40 });

    const Letters = Writer?.textContent?.split("") || [];
    Writer!.innerHTML = Letters.map(l => `<span class="TypeLetter">${l}</span>`).join("");
    const TypeLetters = HeroRef.current!.querySelectorAll(".TypeLetter");
    gsap.set(TypeLetters, { opacity: 0 });

    tl.to(Pedro, {
      y: 0,
      opacity: 1,
      z: 20,
      duration: 0.6,
      ease: "power2.out"
    });

    tl.to(Ramos, {
      opacity: 1,
      z: 15,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3");

    tl.to(FullStack, {
      y: 0,
      opacity: 1,
      z: 10,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3");

    tl.to(Developer, {
      y: 0,
      opacity: 1,
      z: 10,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4");

    tl.to(Engineer, {
      opacity: 1,
      z: 5,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.4");

    tl.to(Technical, {
      x: 0,
      opacity: 1,
      z: 15,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.4");

    tl.to(TypeLetters, {
      opacity: 1,
      stagger: 0.04,
      duration: 0.05
    }, "-=0.3");

    tl.to(HeroRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.6");

  }, HeroRef);

  return () => ctx.revert();
}, []);

  useEffect(() => {
    if (!HeroRef.current) return;

    const hero = HeroRef.current;
    const Strength = 1;

    const HandleMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();

      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(hero, {
        rotationY: x * Strength,
        rotationX: -y * Strength,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    const HandleLeave = () => {
      gsap.to(hero, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    };

    hero.addEventListener("mousemove", HandleMove);
    hero.addEventListener("mouseleave", HandleLeave);

    return () => {
      hero.removeEventListener("mousemove", HandleMove);
      hero.removeEventListener("mouseleave", HandleLeave);
    };
  }, []);

  useScrollEvents((scroll) => {
    if (!HeroRef.current) return;

    const spans = HeroRef.current.querySelectorAll(
      ".Highlight, .Highlight2, .Highlight3, .Highlight4, .Highlight5"
    );

    if (!spans.length) return;

    const progress = Math.min(scroll / 400, 1);

    const total = spans.length;
    const center = (total - 1) / 2;

    spans.forEach((el, i) => {
      const distanceFromCenter = i - center;

      const direction = Math.sign(distanceFromCenter);
      const magnitude = Math.abs(distanceFromCenter);

      const spread = progress * magnitude * 60;
      const depth = progress * magnitude * 20;

      gsap.set(el, {
        x: direction * spread,
        z: depth,
        rotateY: direction * progress * 10,
      });
    });
  });

  useScrollEvents((scroll) => {
    if (!ScrollProgressRef.current) return;

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = Math.min(scroll / maxScroll, 1);

    gsap.set(ScrollProgressRef.current, {
      scaleX: progress
    });
  });

  useEffect(() => {
  if (!TopBarRef.current) return;

  gsap.set(TopBarRef.current, {
    clipPath: "circle(0% at calc(100% - 30px) 25px)",
    opacity: 0,
    rotationX: -20,
    rotationY: 15,
    transformOrigin: "calc(100% - 30px) 25px",
    transformStyle: "preserve-3d"
  });
}, []);

 useEffect(() => {
  if (!TopBarRef.current) return;

  gsap.to(TopBarRef.current, {
    clipPath: menuOpen
      ? "circle(200% at calc(100% - 30px) 25px)"
      : "circle(0% at calc(100% - 30px) 25px)",

    opacity: menuOpen ? 1 : 0,

    rotationX: menuOpen ? 0 : -20,
    rotationY: menuOpen ? 0 : 15,

    duration: 0.8,
    ease: "power4.out",
    delay: menuOpen ? 0.1 : 0
  });

}, [menuOpen]);

  return (
    <div className="MainWrapper">
      <div className="ScrollProgressBar" ref={ScrollProgressRef}></div>

      <button className= "MenuButton" onClick={() => setMenuOpen(!menuOpen)}>
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

        <svg>
            <filter id="displacementFilter">
                <feTurbulence type="turbulence" 
                    baseFrequency="0.01" 
                    numOctaves="2" 
                    result="turbulence" />
        
                <feDisplacementMap in="SourceGraphic"
                    in2="turbulence"    
                                scale="200" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>


      {/* top bar */}
      <nav ref={TopBarRef} className={`TopBar ${menuOpen ? "Open" : ""}`}>
        <div className="TopBarLogoContainer">
          <div id="MainNavLogo" className="Logo">
            <img src="/logo.svg" alt="Logo" />
          </div>

            
          {/*}
          {Items.map((Item, Index) => (
            <div key={Index} className="LogoTextContainer">
              <div id="LogoText" className="top">
                {[...Item].map((Letter, i) => (
                  <span
                    key={i}
                    className="topLetter"
                    style={{ transitionDelay: `${i * 0.05}s` }}
                  >
                    {Letter === " " ? "\u00A0" : Letter}
                  </span>
                ))}
              </div>

              <div id="LogoText" className="bottom">
                {[...Item].map((Letter, i) => (
                  <span
                    key={i}
                    className="bottomLetter"
                    style={{ transitionDelay: `${i * 0.05}s` }}
                  >
                    {Letter === " " ? "\u00A0" : Letter}
                  </span>
                ))}
              </div>
            </div>
          ))}*/}
        </div>

        <div className="TopBarContactContainer">
          {ContactItems.map((Item, Index) => (
            <React.Fragment key={Index}>

              <li className="ContactItem">

                {/* link icon */}
                <img
                  src={Item.icon}
                  alt={Item.icon}
                  className={`ContactIcon ${Item.label === "pedroramosm22@gmail.com" ? "gmail" : ""}`}
                />

                {/* link text */}
                <a className="LogoTextContainer">
                  <div className="top">
                    {[...Item.label].map((Letter, i) => (
                      <span
                        key={i}
                        className="topLetter"
                        style={{ transitionDelay: `${i * 0.05}s` }}
                      >
                        {Letter === " " ? "\u00A0" : Letter}
                      </span>
                    ))}
                  </div>

                  <div className="bottom">
                    {[...Item.label].map((Letter, i) => (
                      <span
                        key={i}
                        className="bottomLetter"
                        style={{ transitionDelay: `${i * 0.05}s` }}
                      >
                        {Letter === " " ? "\u00A0" : Letter}
                      </span>
                    ))}
                  </div>
                </a>
              </li>

              {Index < ContactItems.length - 1 && (
                <span className="ContactDivider"></span>
              )}

            </React.Fragment>
          ))}
        </div>

        <div className="TopBarDividerWrapper">
          <svg
            ref={DividerWrapperRef}
            className="TopBarDivider"
            preserveAspectRatio="none"
            viewBox="0 0 100 20"
          >
            <path
              ref={DividerRef}
              d="M0 20.5 L100 20.5"
              stroke="#87a5a8"
              strokeWidth="2"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </nav>

      <div className="MainContentArea">
        <main>
          <section className="HeroMain">
            <section className="HeroMain">
              <h1 ref={HeroRef} className="HeroTitle">
                <span className="Highlight2">Pedro</span> {/*move down first*/}
                <span className="Highlight4">Ramos</span>  {/*fade in from transparent second*/}
                <span className="Highlight">Full-Stack</span> {/*come in from top under the zindex of Pedro and Ramos third*/}
                <span className="Highlight">Developer;</span> {/*come in from below fourth*/}
                <span className="Highlight3">Software Engineer;</span> {/*highlight stroke then make it transparent then radial from transparent center below fifth*/}
                <span className="InlineGroup">
                  <span className="Highlight5">Technical</span>{" "}
                  <span className="Highlight2">Writer.Editor</span>
                </span>
              </h1>
            </section>
          </section>

          <section className="DummySection"/>
        </main>
      </div>
    </div>
  );
}