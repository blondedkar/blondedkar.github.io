import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../style.css";
import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";


gsap.registerPlugin(ScrollTrigger, SplitText);

export default function MainWebsite() {
  useEffect(() => {
  console.log(`
    ██████╗ ██╗      ██████╗ ███╗   ██╗██████╗ ███████╗
    ██╔══██╗██║     ██╔═══██╗████╗  ██║██╔══██╗██╔════╝
    ██████╔╝██║     ██║   ██║██╔██╗ ██║██║  ██║█████╗  
    ██╔══██╗██║     ██║   ██║██║╚██╗██║██║  ██║██╔══╝  
    ██████╔╝███████╗╚██████╔╝██║ ╚████║██████╔╝███████╗
    ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚══════╝

    ██╗███╗   ██╗████████╗███████╗██████╗  █████╗  ██████╗████████╗██╗██╗   ██╗███████╗
    ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██║██║   ██║██╔════╝
    ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝███████║██║        ██║   ██║██║   ██║█████╗  
    ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══██║██║        ██║   ██║╚██╗ ██╔╝██╔══╝  
    ██║██║ ╚████║   ██║   ███████╗██║  ██║██║  ██║╚██████╗   ██║   ██║ ╚████╔╝ ███████╗
    ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝
    `);
  }, []);



  //const Items = ["blonde Interactive"]; --probably can add this bottom left? maybe...
  const ContactItems = [
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

  const Projects = ["Self", "CPU Rasterizer", "World-Space Mapping", "Modular Systems"]
  const ProjectsHeaderRef = useRef<HTMLHeadingElement>(null); 
  const TopBarRef = useRef<HTMLDivElement>(null);
  const DividerWrapperRef = useRef<SVGSVGElement>(null);
  const DividerRef = useRef<SVGPathElement>(null);
  const HeroRef = useRef<HTMLHeadingElement>(null);
  const ScrollProgressRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const ScrollLabel = useRef<HTMLButtonElement>(null);

  

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

    tl.to(HeroRef.current, {
      y: -150,
    })

    tl.to(ScrollLabel.current, {
      opacity: 1,
      y: 0,
      ease: "sine.in.out"
    })
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
      ease: "power2.out",
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

  gsap.to(hero, {
    scale: 0.1,
    scrollTrigger: {
      start: 0,
      end: "bottom top",
      scrub: true,
    }
  });

  return () => {
    hero.removeEventListener("mousemove", HandleMove);
    hero.removeEventListener("mouseleave", HandleLeave);
  };
}, []);

  useEffect(() => {
  if (!HeroRef.current) return;

  const spans = HeroRef.current.querySelectorAll(
    ".Highlight, .Highlight2, .Highlight3, .Highlight4, .Highlight5"
  );

  if (!spans.length) return;

  const total = spans.length;
  const center = (total - 1) / 2;

  ScrollTrigger.create({
    trigger: HeroRef.current,
    start: 0,
    end: "bottom top",
    scrub: true,

    onUpdate: (self) => {
      const progress = self.progress;

      spans.forEach((el, i) => {
        const distance = i - center;
        const magnitude = Math.abs(distance);

        const localProgress = Math.max(
          0,
          Math.min(1, progress - magnitude * 0.08)
        );

        const flipAmount = localProgress * 120;
        const depth = localProgress * 80;

        gsap.set(el, {
          rotateX: -flipAmount,
          z: depth,
          opacity: 1 - localProgress,
          transformOrigin: "center bottom",
        });
      });
    },
  });

}, []);

  useEffect(() => {
  if (!ScrollProgressRef.current) return;

  ScrollTrigger.create({
    start: 0,
    end: "max",
    scrub: true,

    onUpdate: (self) => {
      gsap.set(ScrollProgressRef.current, {
        scaleX: self.progress
      });
    }
  });

}, []);

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

useEffect(() => {

  const ctx = gsap.context(() => {

    gsap.from(".TitleChar", {
      x: (i) => i % 2 === 0 ? -200 : 200,
      rotateX: -90,
      opacity: 0,
      stagger: 0.08,
      ease: "none",
      scrollTrigger: {
        trigger: ".ProjectsSection",
        start: "40% bottom",
        end: "60% center",
        scrub: true,
        markers: true,
      }
    });

  });

  return () => ctx.revert();

}, []);

useEffect(() => {

  const folders = document.querySelectorAll(".ProjectFolder");

  const handleMove = (e: MouseEvent) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    folders.forEach((folder, i) => {
      gsap.to(folder, {
        rotateY: x * 10,
        rotateX: -y * 10,
        x: x * 20 * (i % 2 === 0 ? 1 : -1),
        y: y * 20,
        duration: 0.6,
        ease: "power2.out"
      });
    });
  };

  window.addEventListener("mousemove", handleMove);

  return () => window.removeEventListener("mousemove", handleMove);

}, []);

useEffect(() => {

  gsap.to(".ProjectFolder", {
    yPercent: (i) => (i % 2 === 0 ? -10 : 10),
    ease: "none",
    scrollTrigger: {
      trigger: ".ProjectsSection",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    }
  });

}, []);

useEffect(() => {
  if (!ProjectsHeaderRef.current) return;

  const ctx = gsap.context(() => {

    const featured = ProjectsHeaderRef.current!.querySelector(".FeaturedWord");
    const projects = ProjectsHeaderRef.current!.querySelector(".ProjectsWord");

    if (!featured || !projects) return;

    gsap.set(featured, {
      x: -200,
      opacity: 0
    });

    gsap.to(featured, {
      x: 0,
      opacity: 1,
      ease: "sine-in",
      scrollTrigger: {
        trigger: featured,
        start: "top bottom",
        end: "top 60%",
        scrub: true,
      }
    });

    const split = new SplitText(projects, { type: "chars" });

    gsap.set(split.chars, {
      y: 80,
      opacity: 0
    });

    gsap.to(split.chars, {
      y: 0,
      opacity: 1,
      stagger: 0.04,
      ease: "none",
      scrollTrigger: {
        trigger: featured,
        start: "top bottom",
        end: "top 50%",
        scrub: true
      }
    });

  }, ProjectsHeaderRef);

  return () => ctx.revert();

}, []);

useEffect(() => {
  const ctx = gsap.context(() => {
    const folders = gsap.utils.toArray<HTMLElement>(".ProjectFolder");
    folders.forEach((folder, i) => {
      const isLeft = i % 2 === 0;

      gsap.from(folder, {
        x: isLeft ? -300 : 300,
        opacity: 0,
        rotateY: isLeft ? -20 : 20,
        ease: "quad-in",
        scrollTrigger: {
          trigger: ".ProjectsSection",
          start: "top 90%",
          end: "top 60%",
          scrub: 0.4,
        }
      });
    });
  });

  return () => ctx.revert();
}, []);

useEffect(() => {
  if (!ScrollLabel.current) return;

  const el = ScrollLabel.current;

  gsap.set(el, {
    x: 50
  })

  gsap.to(el, {
    scale: 0,
    duration: 1,
    scrollTrigger: {
      start: 0,
      end: 200,
      scrub: false,
    }
  });
}, []);

/*organize connections */

  return (
    <div className="MainWrapper">
      <div className="ScrollProgressBar" ref={ScrollProgressRef}></div>
        <svg> {/*credit to the guy on youtube, ill have to find him again */} 
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
      <nav>
        <button
          className="MenuButton"
          onClick={() => setMenuOpen(!menuOpen)}
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
          ref={TopBarRef}
          className={`TopBar ${menuOpen ? "Open" : ""}`}
        >

          {/* logo */}
          <div className="TopBarLogoContainer">
            <div id="MainNavLogo" className="Logo">
              <img src="/logo.svg" alt="Logo" />
            </div>
          </div>

          {/* links */}
          <ul className="TopBarContactContainer">
            {ContactItems.map((Item, Index) => (
              <li className="ContactItem" key={Item.label}>

                <img
                  src={Item.icon}
                  alt={Item.label}
                  className={`ContactIcon ${
                    Item.label === "pedroramosm22@gmail.com"
                      ? "gmail"
                      : ""
                  }`}
                />

                <a
                  href={Item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="AnimatedTextContainer ContactLink"
                >
                  <div className="top">
                    {[...Item.label].map((Letter, i) => (
                      <span
                        key={i}
                        className="topLetter"
                        style={{
                          transitionDelay: `${i * 0.02}s`,
                        }}
                      >
                        {Letter === " "
                          ? "\u00A0"
                          : Letter}
                      </span>
                    ))}
                  </div>

                  <div className="bottom">
                    {[...Item.label].map((Letter, i) => (
                      <span
                        key={i}
                        className="bottomLetter"
                        style={{
                          transitionDelay: `${i * 0.02}s`,
                        }}
                      >
                        {Letter === " "
                          ? "\u00A0"
                          : Letter}
                      </span>
                    ))}
                  </div>
                </a>

                {Index < ContactItems.length - 1 && (
                  <span className="ContactDivider" />
                )}

              </li>
            ))}
          </ul>

          {/* divider path */}
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

        </div>

        <div className={`MobileSidebar ${menuOpen ? "open" : ""}`}>
          {ContactItems.map((Item) => (
            <a
              key={Item.label}
              href={Item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {Item.label}
            </a>
          ))}
        </div>

      </nav>

      <div className="MainContentArea">
        <main>
          <section className="HeroContainer">
            <button ref={ScrollLabel} id="ScrollLabel">
              Scroll ↓
            </button>


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
            
          <section className="FeatureSection">

            <section className="ProjectsSection">
              <div className="ProjectsHeaderWrapper">
                <h1 ref={ProjectsHeaderRef} className="ProjectsHeader">
                  <span className="FeaturedWord">Featured</span>{" "}
                  <span className="ProjectsWord">Projects</span>
                </h1>
              </div>

              <div className="ProjectsGrid">
                {Projects.map((project, i) => (
                  <div className="ProjectFolder" data-project={project} key={i}>
                    <div className="ProjectImage" />
                    <h2 className="ProjectTitle">
                      {[...project].map((letter, idx) => (
                        <span key={idx} className="TitleChar">
                          {letter === " " ? "\u00A0" : letter}
                        </span>
                      ))}
                    </h2>
                  </div>
                ))}
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}