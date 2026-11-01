import { useState } from "react";
import { Link } from "@tanstack/react-router";

/** Decorative landmark skyline (Pisa, Taj Mahal, Big Ben, Eiffel Tower, torii gate, pagoda). */
function LandmarkSkyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 240"
      preserveAspectRatio="xMaxYMax meet"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <g transform="rotate(-5 45 240)">
        <rect x="24" y="70" width="42" height="170" />
        {[78, 100, 122, 144, 166, 188, 210].map((y) => (
          <rect key={y} x="20" y={y} width="50" height="4" />
        ))}
        <rect x="30" y="50" width="30" height="22" />
      </g>

      <rect x="88" y="210" width="116" height="30" />
      <rect x="108" y="168" width="76" height="44" />
      <path d="M116 170 Q116 122 146 112 Q176 122 176 170 Z" />
      <rect x="144.5" y="94" width="3" height="20" />
      <circle cx="114" cy="168" r="9" />
      <circle cx="178" cy="168" r="9" />
      <rect x="92" y="146" width="6" height="66" />
      <rect x="194" y="146" width="6" height="66" />
      <path d="M90 148 L95 136 L100 148 Z M192 148 L197 136 L202 148 Z" />

      <rect x="220" y="80" width="30" height="160" />
      <rect x="216" y="100" width="38" height="34" />
      <path d="M216 100 L235 58 L254 100 Z" />
      <rect x="234" y="36" width="2" height="24" />

      <path d="M280 240 L310 170 L318 120 L326 60 L330 18 L334 60 L342 120 L350 170 L380 240 L356 240 Q330 190 304 240 Z" />
      <rect x="304" y="166" width="52" height="7" />
      <rect x="315" y="117" width="30" height="6" />

      <path d="M392 112 Q435 102 478 112 L476 123 Q435 115 394 123 Z" />
      <rect x="402" y="134" width="66" height="6" />
      <rect x="408" y="118" width="9" height="122" />
      <rect x="453" y="118" width="9" height="122" />
      <rect x="432" y="121" width="6" height="14" />

      <rect x="500" y="150" width="50" height="90" />
      <path d="M490 152 L525 128 L560 152 Z" />
      <rect x="508" y="112" width="34" height="22" />
      <path d="M498 114 L525 92 L552 114 Z" />
      <rect x="523.5" y="74" width="3" height="20" />
    </svg>
  );
}

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-blue-950 px-6 py-8 text-white shadow-lux sm:px-12 sm:py-12">
      <LandmarkSkyline className="pointer-events-none absolute bottom-0 right-4 hidden h-[85%] max-h-60 w-[42%] text-white/[0.09] md:block lg:right-8" />

      <div className="relative max-w-2xl">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Join our Insider-deal Club today!
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-white/75 sm:text-base">
          Be the first to get handpicked Faresdream discounts, error and price-drop fare alerts, and
          coupons available only to email insiders.
        </p>

        <form
          className="mt-7 flex max-w-xl items-center rounded-full border border-white/15 bg-navy p-1.5 pl-5 transition focus-within:border-gold"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full bg-transparent py-2.5 text-sm font-medium text-white outline-none placeholder:text-white/70 sm:text-base"
            />
          </label>
          <button
            type="submit"
            className="h-11 shrink-0 rounded-full bg-gold px-5 text-sm font-semibold text-gold-foreground transition hover:brightness-110 sm:h-12 sm:px-7 sm:text-base"
          >
            Subscribe
          </button>
        </form>

        {done ? (
          <p className="mt-3 text-sm font-semibold text-gold">
            You&apos;re in — insider fares are on the way.
          </p>
        ) : null}

        <p className="mt-4 max-w-xl text-[11px] leading-relaxed text-white/55">
          We&apos;ll never share your info with anyone else. By clicking &quot;Subscribe&quot; you
          agree to our{" "}
          <Link to="/terms" className="underline hover:text-gold">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-gold">
            Privacy Policy
          </Link>
          . You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
