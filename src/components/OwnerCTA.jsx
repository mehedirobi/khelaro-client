import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarRange,
  Store,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Manage your turf",
    description:
      "Keep your venue information, pricing and facilities updated.",
  },
  {
    icon: CalendarRange,
    title: "Manage bookings",
    description:
      "Control available slots and manage customer bookings easily.",
  },
  {
    icon: BarChart3,
    title: "Track performance",
    description:
      "Monitor bookings and revenue from your owner dashboard.",
  },
];

const OwnerCTA = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="owner-cta relative overflow-hidden rounded-[28px] bg-gray-950 shadow-2xl shadow-gray-900/10">
          {/* Background decoration */}
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-green-500/10 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
            aria-hidden="true"
          />

          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
            {/* Content */}
            <div className="p-8 sm:p-12 lg:p-14 xl:p-16">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                For turf owners
              </div>

              {/* Heading */}
              <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight tracking-[-0.025em] text-white sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
                Turn your turf into a{" "}
                <span className="text-green-400">
                  smarter business.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
                List your venue on Khelaro, manage bookings, control
                availability and keep track of your business from one
                simple dashboard.
              </p>

              {/* Benefits */}
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <CheckCircle2
                    size={15}
                    className="text-green-500"
                  />
                  Easy management
                </span>

                <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <CheckCircle2
                    size={15}
                    className="text-green-500"
                  />
                  Booking control
                </span>

                <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <CheckCircle2
                    size={15}
                    className="text-green-500"
                  />
                  Business insights
                </span>
              </div>

              {/* CTA */}
              <Link
                to="/register?role=owner"
                className="group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-green-500 px-5 py-3.5 text-sm font-bold text-gray-950 shadow-lg shadow-green-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-xl hover:shadow-green-500/20"
              >
                List your turf

                <ArrowRight
                  size={17}
                  strokeWidth={2.2}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Features */}
            <div className="border-t border-gray-800/80 bg-gray-900/60 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10 xl:p-12">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="owner-feature group rounded-2xl border border-gray-800 bg-gray-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30 hover:bg-gray-950 hover:shadow-lg hover:shadow-black/20"
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                    >
                      <div className="flex items-start gap-4 lg:gap-0">
                        {/* Icon */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400 transition-all duration-300 group-hover:bg-green-500 group-hover:text-gray-950 group-hover:shadow-lg group-hover:shadow-green-500/10">
                          <Icon
                            size={20}
                            strokeWidth={1.9}
                            className="transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="lg:mt-4">
                          <p className="text-sm font-bold text-white">
                            {feature.title}
                          </p>

                          <p className="mt-1.5 text-xs leading-5 text-gray-500">
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      {/* Indicator */}
                      <div className="mt-4 h-px w-8 origin-left scale-x-0 rounded-full bg-green-500 transition-transform duration-300 group-hover:scale-x-100" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entrance animation */}
      <style>{`
        .owner-cta {
          animation: ownerCtaFade 650ms ease-out both;
        }

        .owner-feature {
          animation: ownerFeatureFade 500ms ease-out both;
        }

        @keyframes ownerCtaFade {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ownerFeatureFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .owner-cta,
          .owner-feature {
            animation: none;
          }

          *,
          *::before,
          *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default OwnerCTA;