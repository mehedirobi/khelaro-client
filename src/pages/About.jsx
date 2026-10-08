import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Clock3,
  Users,
  Target,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Find Nearby Turfs",
    description:
      "Discover quality sports turfs across Dhaka based on location, sport, and availability.",
  },
  {
    icon: Clock3,
    title: "Book in Minutes",
    description:
      "Choose your preferred date and time slot and complete your booking without unnecessary hassle.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Booking",
    description:
      "Get clear booking information and avoid the confusion of calling multiple turf owners.",
  },
];

const values = [
  "Simple and transparent booking",
  "Verified turf listings",
  "Clear pricing and availability",
  "Better experience for players and turf owners",
];

const missionCards = [
  {
    icon: Users,
    title: "For Players",
    description:
      "Find, compare, and book sports turfs with less effort.",
  },
  {
    icon: Target,
    title: "For Owners",
    description:
      "Manage turf listings, bookings, schedules, and revenue from one place.",
  },
  {
    icon: Zap,
    title: "Fast Experience",
    description:
      "A streamlined experience designed around real booking needs.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Platform",
    description:
      "Focused on transparent information and reliable bookings.",
  },
];

const About = () => {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gray-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl animate-[fadeUp_0.7s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">
              About Khelaro
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Making sports turf booking{" "}
              <span className="text-green-400">simple.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              Khelaro is a modern turf discovery and booking platform
              built for sports lovers in Dhaka. We make it easier to
              find the right turf, check availability, and book your
              game in just a few steps.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/turfs"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-500 hover:shadow-xl hover:shadow-green-900/25 focus:outline-none focus:ring-4 focus:ring-green-500/20 active:scale-[0.98]"
              >
                Explore Turfs
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-700/30 active:scale-[0.98]"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="animate-[fadeUp_0.7s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Our Mission
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Spend less time searching.
              <br />
              Spend more time playing.
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
              Finding a good sports turf should not require endless
              phone calls, messages, or uncertainty about available
              slots. Khelaro brings turf discovery and booking into
              one simple platform.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Our goal is to create a trusted marketplace where
              players can confidently book their games and turf
              owners can efficiently manage their facilities.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {missionCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 animate-[fadeUp_0.6s_ease-out_both]"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-green-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold text-gray-900">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Khelaro */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl animate-[fadeUp_0.6s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Why Khelaro
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Built around the way people actually play
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Everything on Khelaro is designed to make the journey
              from finding a turf to starting your game easier.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:shadow-lg hover:shadow-gray-200/50 animate-[fadeUp_0.6s_ease-out_both]"
                  style={{
                    animationDelay: `${index * 90}ms`,
                  }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-green-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center animate-[fadeUp_0.6s_ease-out_both]">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            What We Believe
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            A better way to book your game
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            We are building Khelaro with a focus on convenience,
            transparency, and a better sports experience.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
          {values.map((value, index) => (
            <div
              key={value}
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-100 hover:bg-green-50/40 hover:shadow-sm animate-[fadeUp_0.5s_ease-out_both]"
              style={{
                animationDelay: `${index * 70}ms`,
              }}
            >
              <CheckCircle2
                size={20}
                className="shrink-0 text-green-600 transition-transform duration-300 group-hover:scale-110"
              />

              <span className="text-sm font-medium text-gray-700">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-green-600">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to find your next game?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-green-50">
            Explore sports turfs across Dhaka and book your next
            session with Khelaro.
          </p>

          <Link
            to="/turfs"
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 shadow-lg shadow-green-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 active:scale-[0.98]"
          >
            Find a Turf
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
};

export default About;