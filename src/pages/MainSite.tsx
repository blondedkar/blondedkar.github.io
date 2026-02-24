import { useEffect, useRef } from "react";
import React from "react";
import { gsap } from "gsap";
import "../style.css";

export default function MainWebsite() {
  const Items = ["blonde Interactive"];
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

  useEffect(() => {
  const topBar = TopBarRef.current;
  const svg = DividerWrapperRef.current;
  const path = DividerRef.current;

  if (!topBar || !svg || !path) return;

  const BaseY = 10;
  const MaxHeight = 30;

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

  return (
    <div className="MainWrapper">

      {/* top bar */}
      <div ref={TopBarRef} className="TopBar">

        <div className="TopBarLogoContainer">
          <div id="MainNavLogo" className="Logo">
            <img src="/logo.svg" alt="Logo" />
          </div>

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
          ))}
        </div>

        <div className="TopBarContactContainer">
          {ContactItems.map((Item, Index) => (
            <React.Fragment key={Index}>

              <div className="ContactItem">

                {/* link icon */}
                <img
                  src={Item.icon}
                  alt={Item.label}
                  className="ContactIcon"
                />

                {/* link text */}
                <div className="LogoTextContainer">
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
                </div>

              </div>

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
              d="M0 10 L100 10"
              stroke="#87a5a8"
              strokeWidth="2"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      <div className="MainContentArea" />
  
    </div>
  );
}