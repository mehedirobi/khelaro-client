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

const About = () => {
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

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gray-950">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
              >
                Explore Turfs
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-900"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
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
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Users size={21} />
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                For Players
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Find, compare, and book sports turfs with less
                effort.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Target size={21} />
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                For Owners
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Manage turf listings, bookings, schedules, and
                revenue from one place.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Zap size={21} />
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                Fast Experience
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                A streamlined experience designed around real
                booking needs.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <ShieldCheck size={21} />
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                Trusted Platform
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Focused on transparent information and reliable
                bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Khelaro helps */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
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
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
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
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
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
          {values.map((value) => (
            <div
              key={value}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <CheckCircle2
                size={20}
                className="shrink-0 text-green-600"
              />

              <span className="text-sm font-medium text-gray-700">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to find your next game?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-green-50">
            Explore sports turfs across Dhaka and book your next
            session with Khelaro.
          </p>

          <Link
            to="/turfs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-gray-100"
          >
            Find a Turf
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;