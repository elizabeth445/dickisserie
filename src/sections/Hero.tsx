import { useRef } from "react";
import { gsap, useGSAP } from "../animations/gsap";
import { HeroArtwork } from "../components/HeroArtwork";
import { content } from "../data/content";
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduced: "(prefers-reduced-motion:reduce)",
          desktop: "(min-width:1101px)",
        },
        (ctx) => {
          if (ctx.conditions?.reduced) return;
          const tl = gsap.timeline({
            id: "hero-intro",
            defaults: { ease: "power3.out" },
          });
          tl.from(
            ".masthead span",
            { yPercent: 105, duration: 0.9, stagger: 0.018 },
            0.05,
          )
            .from(
              ".hero-copy h2",
              { clipPath: "inset(0 100% 0 0)", duration: 0.8 },
              0.22,
            )
            .from(
              ".hero-copy p,.hero-cta",
              { opacity: 0, y: 8, duration: 0.45, stagger: 0.08 },
              0.5,
            );
          if (ctx.conditions?.desktop) {
            gsap.to(".hero-scene-motion", {
              y: 24,
              scale: 1.015,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <section
      id="home"
      className="hero"
      ref={ref}
      aria-label="DICKISSERIE adult waffle and cocktail bar"
    >
      <HeroArtwork />
      <div className="hero-layout shell">
        <div className="hero-copy">
          <h1 className="masthead" aria-label={content.brand}>
            {content.brand.split("").map((letter, i) => (
              <span aria-hidden="true" key={i}>
                {letter}
              </span>
            ))}
          </h1>
          <h2>
            <span>{content.hero.first}</span>
            <em>{content.hero.second}</em>
          </h2>
          <p>{content.hero.line}</p>
          <div className="hero-cta">
            <a className="button primary" href="#menu">
              {content.hero.cta}
            </a>
            <a className="text-link" href="#visit">
              Find us in Vilnius
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
