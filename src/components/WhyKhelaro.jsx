import {
  ShieldCheck,
  Clock3,
  CreditCard,
  Headphones,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified turfs",
    description:
      "Find reliable venues with accurate information and trusted listings.",
  },
  {
    icon: Clock3,
    title: "Easy availability",
    description:
      "Check available playing slots before you make your booking.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description:
      "Complete your booking through a secure and convenient payment flow.",
  },
  {
    icon: Headphones,
    title: "Helpful support",
    description:
      "Get assistance when you need help with your booking or account.",
  },
];

const WhyKhelaro = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-green-100/50 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          {/* Left Content */}
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Why Khelaro
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-extrabold tracking-[-0.025em] text-gray-950 sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
              Everything you need to get on the field.
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
              Khelaro makes turf discovery and booking simpler for
              players while helping turf owners manage their venues
              more efficiently.
            </p>

            {/* Mini trust block */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-50 bg-green-100 text-xs font-bold text-green-700">
                  K
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-50 bg-gray-200 text-xs font-bold text-gray-600">
                  +
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-50 bg-gray-900 text-xs font-bold text-white">
                  ✓
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Built around your game
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Simple booking. Better experience.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="why-card group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-gray-900/[0.06]"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-green-100/0 blur-2xl transition-all duration-500 group-hover:bg-green-100/80"
                    aria-hidden="true"
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-green-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-green-600/20">
                      <Icon
                        size={21}
                        strokeWidth={1.9}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="mt-5 flex items-start justify-between gap-3">
                      <h3 className="font-bold tracking-tight text-gray-900">
                        {feature.title}
                      </h3>

                      <ArrowUpRight
                        size={16}
                        className="mt-0.5 shrink-0 text-gray-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-600"
                      />
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {feature.description}
                    </p>

                    {/* Bottom indicator */}
                    <div className="mt-5 h-0.5 w-7 origin-left scale-x-0 rounded-full bg-green-500 transition-transform duration-300 group-hover:scale-x-100" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Entrance animation */}
      <style>{`
        .why-card {
          animation: whyCardFadeUp 500ms ease-out both;
        }

        @keyframes whyCardFadeUp {
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
          .why-card {
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

export default WhyKhelaro;