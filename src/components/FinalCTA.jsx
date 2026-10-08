import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-green-500/[0.06] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[28px] bg-gray-950 px-6 py-14 text-center shadow-2xl shadow-gray-900/10 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          {/* Glow */}
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-green-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-2xl">
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-green-400/20 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/5">
              <Search size={23} strokeWidth={2} />
            </div>

            {/* Badge */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
              <MapPin size={12} className="text-green-400" />
              Your next game starts here
            </div>

            {/* Heading */}
            <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.025em] text-white sm:text-4xl lg:text-[44px] lg:leading-tight">
              Ready for your{" "}
              <span className="text-green-400">next game?</span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              Find a turf near you, choose an available slot, and get
              your game started without the hassle.
            </p>

            {/* Benefits */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <CheckCircle2
                  size={15}
                  className="text-green-500"
                />
                Verified turfs
              </span>

              <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <CheckCircle2
                  size={15}
                  className="text-green-500"
                />
                Easy booking
              </span>

              <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <CheckCircle2
                  size={15}
                  className="text-green-500"
                />
                Available slots
              </span>
            </div>

            {/* CTA */}
            <Link
              to="/turfs"
              className="group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-bold text-gray-950 shadow-lg shadow-green-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-xl hover:shadow-green-500/20"
            >
              Find a turf

              <ArrowRight
                size={17}
                strokeWidth={2.2}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Entrance animation */}
      <style>{`
        .final-cta {
          animation: finalCtaFade 650ms ease-out both;
        }

        @keyframes finalCtaFade {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .final-cta {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;