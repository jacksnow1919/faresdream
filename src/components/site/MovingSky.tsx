/** Free Unsplash photo: deep blue sky above a carpet of clouds. */
const SKY_BASE =
  "https://images.unsplash.com/photo-1637446857758-edf6fe04d67a?auto=format&fit=crop&q=65";
const SKY_WIDTHS = [640, 960, 1280, 1600, 2000];
/** Phones download a ~640px photo instead of the full 2000px one (the home page's LCP image). */
export const SKY_SRCSET = SKY_WIDTHS.map((w) => `${SKY_BASE}&w=${w} ${w}w`).join(", ");
export const SKY_SRC = `${SKY_BASE}&w=1280`;

/** Soft cloud wisps drifting across the sky: vertical position, size, speed and start offset. */
const PUFFS = [
  { top: "14%", w: 320, h: 70, dur: 70, delay: -20, opacity: 0.55 },
  { top: "34%", w: 460, h: 110, dur: 55, delay: -45, opacity: 0.7 },
  { top: "52%", w: 380, h: 100, dur: 46, delay: -8, opacity: 0.8 },
  { top: "64%", w: 620, h: 160, dur: 62, delay: -30, opacity: 0.9 },
  { top: "78%", w: 520, h: 140, dur: 50, delay: -38, opacity: 0.95 },
  { top: "26%", w: 260, h: 60, dur: 82, delay: -60, opacity: 0.45 },
];

/**
 * Animated sky that fills its positioned parent (animations live in styles.css).
 * It clips itself, so the parent can stay overflow-visible for the search dropdowns.
 */
export function MovingSky() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] bg-sky-700 [container-type:inline-size]"
    >
      <img
        src={SKY_SRC}
        srcSet={SKY_SRCSET}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="sky-pan absolute -inset-[6%] h-[112%] w-[112%] max-w-none object-cover object-[center_35%]"
      />
      {PUFFS.map((p) => (
        <span
          key={p.top}
          className="cloud-puff absolute left-0"
          style={{
            top: p.top,
            width: p.w,
            height: p.h,
            opacity: p.opacity,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
