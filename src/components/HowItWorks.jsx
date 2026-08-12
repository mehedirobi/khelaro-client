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
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Simple process
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Book your game in 3 steps
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
            No calls, no unnecessary hassle. Find your turf and get
            your game started.
          </p>
        </div>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          {/* Connector */}
          <div className="absolute left-[20%] right-[20%] top-12 hidden border-t border-dashed border-gray-200 md:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative text-center"
              >
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <Icon size={28} className="text-green-600" />

                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;