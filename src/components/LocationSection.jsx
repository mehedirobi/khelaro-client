import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowUpRight,
  Building2,
  Users,
  ChevronRight,
} from "lucide-react";

const locations = [
  {
    name: "Mirpur",
    turfCount: "12+ turfs",
  },
  {
    name: "Uttara",
    turfCount: "10+ turfs",
  },
  {
    name: "Mohammadpur",
    turfCount: "8+ turfs",
  },
  {
    name: "Dhanmondi",
    turfCount: "7+ turfs",
  },
  {
    name: "Badda",
    turfCount: "6+ turfs",
  },
  {
    name: "Bashundhara",
    turfCount: "5+ turfs",
  },
];

const LocationSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-green-50/70 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-40 bottom-10 h-72 w-72 rounded-full bg-emerald-50/50 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Explore Dhaka
            </div>

            <h2 className="text-3xl font-extrabold tracking-[-0.025em] text-gray-950 sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
              Find a turf near you
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
              Explore popular areas and discover sports turfs close to
              where you play.
            </p>
          </div>

          {/* View all */}
          <Link
            to="/turfs"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:text-green-700 hover:shadow-md"
          >
            View all locations

            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Location Grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {locations.map((location, index) => (
            <Link
              key={location.name}
              to={`/turfs?location=${location.name.toLowerCase()}`}
              className="location-card group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/[0.06]"
              style={{
                animationDelay: `${index * 70}ms`,
              }}
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-green-100/0 blur-2xl transition-all duration-500 group-hover:bg-green-100/80" />

              <div className="relative flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  {/* Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-green-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-green-600/20">
                    <MapPin
                      size={20}
                      strokeWidth={1.9}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5"
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-bold text-gray-900 transition-colors duration-300 group-hover:text-green-700">
                      {location.name}
                    </h3>

                    <span className="mt-1.5 inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 transition-colors duration-300 group-hover:bg-green-50 group-hover:text-green-600">
                      {location.turfCount}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-100 text-gray-300 transition-all duration-300 group-hover:border-green-100 group-hover:bg-green-50 group-hover:text-green-600">
                  <ArrowUpRight
                    size={17}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </div>

              {/* Bottom progress line */}
              <span className="absolute bottom-0 left-5 right-5 h-0.5 origin-left scale-x-0 rounded-full bg-green-500 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        {/* Information Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Network */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:border-green-100 hover:bg-green-50/50 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-green-600 group-hover:text-white">
                <Building2 size={21} strokeWidth={1.9} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">
                    Growing turf network
                  </p>

                  <ChevronRight
                    size={14}
                    className="text-gray-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-green-500"
                  />
                </div>

                <p className="mt-1.5 max-w-md text-xs leading-5 text-gray-500">
                  More verified venues are joining Khelaro every day.
                </p>
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:border-green-100 hover:bg-green-50/50 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-green-600 group-hover:text-white">
                <Users size={21} strokeWidth={1.9} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">
                    Built for local players
                  </p>

                  <ChevronRight
                    size={14}
                    className="text-gray-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-green-500"
                  />
                </div>

                <p className="mt-1.5 max-w-md text-xs leading-5 text-gray-500">
                  Find a convenient place for your next game.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        .location-card {
          animation: locationFadeUp 500ms ease-out both;
        }

        @keyframes locationFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .location-card {
            animation: none;
          }

          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LocationSection;