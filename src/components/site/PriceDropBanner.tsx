import { Link } from "@tanstack/react-router";

/** Free Unsplash License image (photo id), 3840×2160. */
const PHOTO = "1790597038269-79fa27e48909";

const photoUrl = (w: number) =>
  `https://images.unsplash.com/photo-${PHOTO}?auto=format&fit=max&w=${w}&q=85`;

/**
 * Photo banner inviting visitors to sign in for flight savings. The photo sits beside the
 * text on wide screens and above it on phones, fading into the dark panel either way.
 */
export function PriceDropBanner() {
  return (
    <section className="px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
      <div className="relative mx-auto flex min-h-[500px] max-w-page flex-col justify-end overflow-hidden rounded-3xl bg-stone-950 shadow-card sm:min-h-[560px] lg:min-h-[430px] lg:justify-center">
        <div className="absolute inset-x-0 top-0 h-[60%] sm:h-[66%] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[74%]">
          <img
            src={photoUrl(1400)}
            srcSet={`${photoUrl(900)} 900w, ${photoUrl(1400)} 1400w, ${photoUrl(2000)} 2000w, ${photoUrl(2800)} 2800w`}
            sizes="(min-width: 1280px) 890px, (min-width: 1024px) 74vw, 100vw"
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top"
          />
          <span className="absolute inset-0 -bottom-1 bg-linear-to-t from-stone-950 from-2% via-transparent via-35% to-transparent lg:-left-1 lg:bottom-0 lg:bg-linear-to-r lg:via-45%" />
        </div>
        <div className="relative max-w-md px-6 pb-8 sm:max-w-lg sm:px-10 sm:pb-10 lg:max-w-[42%] lg:px-12 lg:py-10 xl:px-14">
          <h2 className="font-display text-3xl font-bold leading-[1.1] text-white sm:text-4xl xl:text-5xl">
            Get flight price drops in your inbox
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
            Log in or sign up to hear about the biggest savings on flights.
          </p>
          <Link
            to="/auth"
            className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-stone-950 transition hover:bg-white/90"
          >
            Continue
          </Link>
        </div>
      </div>
    </section>
  );
}
