import {
  Search,
  CalendarCheck2,
  Play,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find a turf",
    description:
      "Search nearby turfs by location, sport, date and availability.",
  },
  {
    number: "02",
    icon: CalendarCheck2,
    title: "Choose your slot",
    description:
      "Pick an available time slot that works for you and your team.",
  },
  {
    number: "03",
    icon: Play,
    title: "Book & play",
    description:
      "Confirm your booking, complete payment and get ready to play.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-green-100/50 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            Simple process
          </div>

          <h2 className="text-3xl font-extrabold tracking-[-0.025em] text-gray-950 sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
            Book your game in 3 steps
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
            No calls, no unnecessary hassle. Find your turf, choose
            your slot, and get your game started.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
          {/* Connector */}
          <div
            className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[52px] hidden h-px bg-gradient-to-r from-transparent via-green-200 to-transparent md:block"
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="how-step group relative rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-green-200 hover:shadow-xl hover:shadow-gray-900/[0.06] sm:p-8"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Step icon */}
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:border-green-200 group-hover:bg-green-50 group-hover:shadow-lg group-hover:shadow-green-600/10">
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-green-600 group-hover:text-white">
                    <Icon
                      size={27}
                      strokeWidth={1.9}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Number */}
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-gray-50 bg-gray-950 text-[10px] font-bold tracking-wide text-white shadow-sm transition-all duration-300 group-hover:border-green-50 group-hover:bg-green-600">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold tracking-tight text-gray-900">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
                    {step.description}
                  </p>
                </div>

                {/* Bottom indicator */}
                <div className="mx-auto mt-6 h-1 w-8 origin-center scale-x-0 rounded-full bg-green-500 transition-transform duration-300 group-hover:scale-x-100" />

                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div
                    className="absolute -bottom-6 left-1/2 h-6 w-px border-l border-dashed border-green-200 md:hidden"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Simple, fast and hassle-free booking
            <ArrowRight
              size={14}
              className="transition-transform duration-300 hover:translate-x-1"
            />
          </div>
        </div>
      </div>

      {/* Entrance animation */}
      <style>{`
        .how-step {
          animation: howStepFadeUp 550ms ease-out both;
        }

        @keyframes howStepFadeUp {
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
          .how-step {
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

export default HowItWorks;