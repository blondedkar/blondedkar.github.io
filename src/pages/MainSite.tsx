import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { gsap } from "gsap";
import "../style.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useNavigate } from "react-router-dom";
import {
  navigateWithViewTransition,
  projectDirections,
  resetPageScroll
} from "../utils/viewTransitions";

const projectCards = [
  {
    title: "Self",
    path: "/SiteProject",
    tech: [
      { label: "HTML", src: "/HTML.png" },
      { label: "TypeScript", src: "/TypeScript.png" },
      { label: "CSS", src: "/CSS.png" },
      { label: "Vite", src: "/Vite.png" },
      { label: "React", src: "/React.png" },
      { label: "GSAP", src: "/GSAP.png" }
    ]
  },
  {
    title: "CPU Rasterizer",
    path: "/RastProject",
    tech: [
      { label: "Luau", src: "/Luau.svg" },
      { label: "Lua", src: "/Lua.svg" }
    ]
  },
  {
    title: "Skubal Portfolio Project",
    path: "/SkubalProject",
    tech: [
      { label: "HTML", src: "/HTML.png" },
      { label: "TypeScript", src: "/TypeScript.png" },
      { label: "NextJS", src: "/NextJS.webp" },
      { label: "GSAP", src: "/GSAP.png" }
    ]
  }
] as const;

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function MainWebsite() {
  const navigate = useNavigate();
  const scrollLetters = [..."SCROLL"];

  const handleProjectPointerMove = (
    event: PointerEvent<HTMLAnchorElement>
  ) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.setProperty("--parallax-x", `${offsetX * 28}px`);
    card.style.setProperty("--parallax-y", `${offsetY * 28}px`);
    card.style.setProperty("--parallax-rotate-x", `${offsetY * -8}deg`);
    card.style.setProperty("--parallax-rotate-y", `${offsetX * 10}deg`);
  };

  const resetProjectPointer = (event: PointerEvent<HTMLAnchorElement>) => {
    const card = event.currentTarget;

    card.style.setProperty("--parallax-x", "0px");
    card.style.setProperty("--parallax-y", "0px");
    card.style.setProperty("--parallax-rotate-x", "0deg");
    card.style.setProperty("--parallax-rotate-y", "0deg");
  };

  useEffect(() => {
    resetPageScroll();
  }, []);

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

  const ProjectsHeaderRef = useRef<HTMLHeadingElement>(null); 
  const HeroRef = useRef<HTMLHeadingElement>(null);
  const ScrollLabel = useRef<HTMLButtonElement>(null);
  const BackgroundRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!ScrollLabel.current) return;

  const ctx = gsap.context(() => {
    const word = ScrollLabel.current!.querySelector(".ScrollPromptWord");
    const letters = ScrollLabel.current!.querySelectorAll(".ScrollPromptLetter");

    if (!word || !letters.length) return;

    gsap.set(word, {
      transformPerspective: 1000,
      transformOrigin: "center center"
    });

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.7
    });

    tl.to(letters, {
      y: -12,
      duration: 0.22,
      ease: "power2.out",
      stagger: 0.045
    });

    tl.to(letters, {
      y: 0,
      duration: 0.28,
      ease: "bounce.out",
      stagger: 0.045
    });

    tl.to(word, {
      rotationY: -90,
      z: 16,
      duration: 0.32,
      ease: "power2.in"
    }, "+=0.1");

    tl.to(word, {
      rotationY: -180,
      z: 0,
      duration: 0.3,
      ease: "power2.inOut"
    });

    tl.to(word, {
      rotationY: -90,
      z: 16,
      duration: 0.34,
      ease: "power2.inOut"
    }, "+=0.08");

    tl.to(word, {
      rotationY: 0
      ,
      z: 0,
      duration: 0.34,
      ease: "power2.out"
    });
  }, ScrollLabel);

  return () => ctx.revert();
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

    gsap.set(ScrollLabel.current, { y: 18 });

    const Letters = Writer?.textContent?.split("") || [];
    Writer!.innerHTML = Letters.map(l => `<span class="TypeLetter">${l}</span>`).join("");
    const TypeLetters = HeroRef.current!.querySelectorAll(".TypeLetter");
    gsap.set(TypeLetters, { opacity: 0 });

   tl.set(HeroRef.current, {
      opacity: 1,
      y: 0
    });

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

  const ctx = gsap.context(() => {

    gsap.from(".TitleChar", {
      x: (i) => i % 2 === 0 ? -200 : 200,
      rotateX: -90,
      opacity: 0,
      stagger: 0.08,
      ease: "none",
      scrollTrigger: {
        trigger: ".ProjectsSection",
        start: "20% bottom",
        end: "35% center",
        scrub: true,
      }
    });

  });

  return () => ctx.revert();

}, []);

// useEffect(() => {

//   const folders = document.querySelectorAll(".ProjectFolder");

//   const handleMove = (e: MouseEvent) => {
//     const x = e.clientX / window.innerWidth - 0.5;
//     const y = e.clientY / window.innerHeight - 0.5;

//     folders.forEach((folder, i) => {
//       gsap.to(folder, {
//         rotateY: x * 10,
//         rotateX: -y * 10,
//         x: x * 20 * (i % 2 === 0 ? 1 : -1),
//         y: y * 20,
//         duration: 0.6,
//         ease: "power2.out"
//       });
//     });
//   };

//   window.addEventListener("mousemove", handleMove);

//   return () => window.removeEventListener("mousemove", handleMove);

// }, []);

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".ProjectsSection",
        start: "top 75%",
        end: "center 20%",
        scrub: true,
      }
    });

    folders.forEach((folder, i) => {
      const isLeft = i % 2 === 0;

      tl.from(folder, {
        x: isLeft ? -200 : 200,
        opacity: 0,
        rotateY: isLeft ? -15 : 15,
        ease: "none",
        duration: 1
      }, i * 0.25);
    });
  });

  return () => ctx.revert();
}, []);

useEffect(() => {
  const ctx = gsap.context(() => {
    const folders = gsap.utils.toArray<HTMLElement>(".ProjectFolder");

    folders.forEach((folder) => {
      const icons = folder.querySelectorAll<HTMLElement>(".ProjectTechIcon");
      const techCount = Number(folder.dataset.techCount ?? "0");

      gsap.to(folder, {
        "--scroll-parallax-y": techCount >= 6 ? "10px" : "8px",
        ease: "none",
        scrollTrigger: {
          trigger: folder,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      icons.forEach((icon, index) => {
        const xDirection = index % 2 === 0 ? -1 : 1;
        gsap.to(icon, {
          "--icon-scroll-x": `${xDirection * (techCount >= 6 ? 8 : 6)}px`,
          ease: "none",
          scrollTrigger: {
            trigger: folder,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    });
  });

  return () => ctx.revert();
}, []);

useEffect(() => {
  if (!ScrollLabel.current) return;
  
  const el = ScrollLabel.current;

  gsap.to(el, {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: 260,
      scrub: true,
    }
  });
}, []);


  return (
    <div ref={BackgroundRef} className="MainWrapper">
      <div className="MainContentArea">
        <main>
          <section className="HeroContainer">
            <button ref={ScrollLabel} id="ScrollLabel">
              <span className="ScrollPromptWord" aria-label="Scroll down">
                {scrollLetters.map((letter, index) => (
                  <span key={index} className="ScrollPromptLetter">
                    {letter}
                  </span>
                ))}
              </span>
              <span className="ScrollPromptArrow" aria-hidden="true">
                ↓
              </span>
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
                {projectCards.map((project, i) => (
                  <a
                    className="ProjectFolder"
                    data-project={project.title}
                    data-tech-count={project.tech.length}
                    href={project.path}
                    key={i}
                    onPointerMove={handleProjectPointerMove}
                    onPointerLeave={resetProjectPointer}
                    onClick={(event) => {
                      event.preventDefault();

                      const direction = projectDirections[project.path];
                      if (!direction) {
                        navigate(project.path);
                        return;
                      }

                      navigateWithViewTransition(navigate, project.path, direction);
                    }}
                  >
                    <div className="ProjectImage" />
                    <div className="ProjectTechGrid" aria-hidden="true">
                      {project.tech.map((icon, iconIndex) => (
                        <span
                          key={`${project.title}-${icon.label}`}
                          className="ProjectTechIcon"
                          style={
                            {
                              "--icon-index": iconIndex
                            } as CSSProperties
                          }
                        >
                          <img src={icon.src} alt="" />
                        </span>
                      ))}
                    </div>
                    <h2 className="ProjectTitle">
                      {[...project.title].map((letter, idx) => (
                        <span key={idx} className="TitleChar">
                          {letter === " " ? "\u00A0" : letter}
                        </span>
                      ))}
                    </h2>
                  </a>
                ))}
              </div>
            </section>

            <section className="UpcomingProjects"> 
              <span className="FeaturedWord">New Projects</span>{" "}
              <span className="ProjectsWord">Coming Soon</span>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
