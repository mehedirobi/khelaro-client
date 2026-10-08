import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import TurfCard from "./TurfCard";
import { turfs } from "../data/turfs";

const FeaturedTurfs = () => {
  const featuredTurfs = turfs.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-green-500/[0.06] blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-emerald-500/[0.05] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-green-700">
              <Sparkles size={13} strokeWidth={2.2} />
              Featured venues
            </div>

            {/* Heading */}
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.025em] text-gray-950 sm:text-4xl lg:text-[42px]">
              Popular turfs to play
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Discover some of the most popular sports venues around
              Dhaka and find the perfect place for your next game.
            </p>
          </div>

          {/* View all */}
          <Link
            to="/turfs"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-200 hover:text-green-600 hover:shadow-md"
          >
            Explore all turfs

            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Turf cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-7">
          {featuredTurfs.map((turf, index) => (
            <div
              key={turf.id}
              className="featured-turf-card"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <TurfCard turf={turf} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center lg:mt-12">
          <Link
            to="/turfs"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-green-600"
          >
            Browse all available turfs

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      <style>{`
        .featured-turf-card {
          animation: featuredTurfFade 600ms ease-out both;
        }

        @keyframes featuredTurfFade {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .featured-turf-card {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedTurfs;