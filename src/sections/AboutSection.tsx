import { useRef } from "react";
import { gsap, useGSAP } from "../animations/gsap";
import { content } from "../data/content";
export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 701px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            ".bar-photo-inner",
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <section
      id="bar"
      className="bar-section shell"
      ref={ref}
      aria-labelledby="bar-heading"
    >
      <figure className="bar-collage">
        <div className="bar-images">
          <div className="bar-photo">
            <img
              className="bar-photo-inner"
              src="/assets/interior-bar.webp"
              srcSet="/assets/interior-bar-640.webp 636w, /assets/interior-bar.webp 1275w"
              sizes="(max-width: 700px) calc(82vw - 32.8px), 35vw"
              alt="DICKISSERIE interior concept: a pink bar, emerald seating and sculptural pendant lights"
              width="1275"
              height="1700"
              loading="lazy"
            />
          </div>
          <div className="cocktail-photo">
            <img
              src="/assets/bar-editorial.webp"
              srcSet="/assets/bar-editorial-640.webp 640w, /assets/bar-editorial.webp 1275w"
              sizes="(max-width: 700px) calc(48vw - 19.2px), 20vw"
              alt="Interior visualisation of a DICKISSERIE cocktail and waffle on a candlelit pink table"
              width="1275"
              height="1700"
              loading="lazy"
            />
          </div>
        </div>
      </figure>
      <div className="bar-editorial">
        <h2 id="bar-heading">
          {content.bar.title.split("\n")[0]}
          <em>{content.bar.title.split("\n")[1]}</em>
        </h2>
        <p>{content.bar.text}</p>
        {content.bar.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <a className="text-link" href="#visit">
          Plan your visit
        </a>
      </div>
    </section>
  );
}
