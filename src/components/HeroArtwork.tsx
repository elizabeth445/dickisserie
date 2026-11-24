import { useEffect, useRef, useState } from "react";

type Playback = "playing" | "paused" | "blocked" | "ended" | "unavailable";
type ConnectionNavigator = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function HeroArtwork() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wantsPlayback = useRef(true);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [saveData] = useState(() =>
    Boolean((navigator as ConnectionNavigator).connection?.saveData),
  );
  const [source] = useState(() => {
    const connection = (navigator as ConnectionNavigator).connection;
    if (/^(slow-2g|2g|3g)$/.test(connection?.effectiveType ?? "")) {
      return "/assets/hero-motion-720.mp4";
    }
    const width = window.innerWidth;
    return width > 1100 ||
      (width > 700 && width * window.devicePixelRatio > 2000)
      ? "/assets/hero-motion-4k.mp4"
      : "/assets/hero-motion-1080.mp4";
  });
  const [playback, setPlayback] = useState<Playback>("playing");
  const enabled = !reduced && !saveData;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !video) return;
    let visible = true;
    let disposed = false;
    const syncPlayback = () => {
      if (
        visible &&
        !document.hidden &&
        wantsPlayback.current &&
        !video.ended
      ) {
        void video.play().catch(() => {
          if (!disposed) setPlayback(video.error ? "unavailable" : "blocked");
        });
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(video.closest(".hero")!);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [enabled]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused && !video.ended) {
      wantsPlayback.current = false;
      video.pause();
    } else {
      wantsPlayback.current = true;
      if (video.ended) video.currentTime = 0;
      setPlayback("playing");
      void video
        .play()
        .catch(() => setPlayback(video.error ? "unavailable" : "blocked"));
    }
  }

  const label =
    playback === "ended"
      ? "Replay animation"
      : playback === "playing"
        ? "Pause animation"
        : "Play animation";

  return (
    <div className="hero-artwork">
      <div className="hero-photograph" aria-hidden="true">
        <div className="hero-scene-motion">
          <picture className="hero-still">
            <source
              type="image/avif"
              srcSet="/assets/hero-scene-extended-1100.avif 1100w, /assets/hero-scene-extended.avif 1672w"
              sizes="(max-width:700px) 680px, 100vw"
            />
            <img
              src="/assets/hero-scene-extended.webp"
              srcSet="/assets/hero-scene-extended-1100.webp 1100w, /assets/hero-scene-extended.webp 1672w"
              sizes="(max-width:700px) 680px, 100vw"
              width="1672"
              height="1882"
              alt=""
              fetchPriority="high"
            />
          </picture>
          {enabled ? (
            <video
              ref={videoRef}
              className={`hero-video${playback === "ended" || playback === "unavailable" || playback === "blocked" ? " is-finished" : ""}`}
              src={source}
              poster="/assets/hero-motion-first.webp"
              width="3840"
              height="2160"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
              onPlay={() => setPlayback("playing")}
              onPause={(event) => {
                if (!event.currentTarget.ended && !event.currentTarget.error)
                  setPlayback("paused");
              }}
              onEnded={() => {
                wantsPlayback.current = false;
                setPlayback("ended");
              }}
              onError={() => setPlayback("unavailable")}
            />
          ) : null}
        </div>
      </div>
      {enabled && playback !== "unavailable" ? (
        <button
          className="hero-motion-control"
          onClick={togglePlayback}
          aria-label={label}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {playback === "playing" ? (
              <path d="M8 5v14M16 5v14" />
            ) : playback === "ended" ? (
              <>
                <path d="M5 8a8 8 0 1 1-1 7" />
                <path d="M5 3v5h5" />
              </>
            ) : (
              <path d="m8 5 11 7-11 7Z" />
            )}
          </svg>
        </button>
      ) : null}
    </div>
  );
}
