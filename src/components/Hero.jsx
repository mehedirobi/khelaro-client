import { useState } from "react";
import {
  Search,
  MapPin,
  CalendarDays,
  Trophy,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const Hero = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [sport, setSport] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    console.log({
      location,
      date,
      sport,
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="relative isolate overflow-hidden bg-gray-950">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Glow */}
        <div className="absolute -left-40 top-0 h-[420px] w-[420px] animate-[heroFloat_8s_ease-in-out_infinite] rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute -right-40 bottom-0 h-[460px] w-[460px] animate-[heroFloat_10s_ease-in-out_infinite_reverse] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/5 blur-3xl" />

        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-950 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-7 inline-flex animate-[heroFadeUp_600ms_ease-out] items-center gap-2 rounded-full border border-green-500/15 bg-green-500/5 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-green-400 shadow-sm shadow-green-500/5 sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>

            Find & book turfs across Dhaka
          </div>

          {/* Heading */}
          <h1 className="animate-[heroFadeUp_700ms_ease-out] text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Find Your Game.
            <span className="mt-1 block bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              Book Your Turf.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl animate-[heroFadeUp_800ms_ease-out] text-sm leading-6 text-gray-400 sm:text-base sm:leading-7 lg:text-lg">
            Discover the best sports venues around Dhaka, check available
            slots, and book your game in just a few clicks.
          </p>

          {/* Search Card */}
          <form
            onSubmit={handleSearch}
            className="group mx-auto mt-9 max-w-5xl animate-[heroFadeUp_900ms_ease-out] rounded-3xl border border-white/10 bg-white p-2 shadow-2xl shadow-black/30 sm:mt-10 sm:p-3"
          >
            <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto]">
              {/* Location */}
              <div className="search-field group/field">
                <MapPin
                  size={19}
                  strokeWidth={1.9}
                  className="shrink-0 text-green-600 transition-transform duration-300 group-hover/field:scale-110"
                />

                <div className="ml-3 min-w-0 flex-1 text-left">
                  <label
                    htmlFor="location"
                    className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400"
                  >
                    Location
                  </label>

                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-gray-800 outline-none"
                  >
                    <option value="">Any location</option>
                    <option value="mirpur">Mirpur</option>
                    <option value="uttara">Uttara</option>
                    <option value="mohammadpur">Mohammadpur</option>
                    <option value="dhanmondi">Dhanmondi</option>
                    <option value="badda">Badda</option>
                    <option value="bashundhara">Bashundhara</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="search-field group/field">
                <CalendarDays
                  size={19}
                  strokeWidth={1.9}
                  className="shrink-0 text-green-600 transition-transform duration-300 group-hover/field:scale-110"
                />

                <div className="ml-3 min-w-0 flex-1 text-left">
                  <label
                    htmlFor="date"
                    className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400"
                  >
                    Date
                  </label>

                  <input
                    id="date"
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-0.5 w-full cursor-pointer bg-transparent text-sm font-semibold text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* Sport */}
              <div className="search-field group/field">
                <Trophy
                  size={19}
                  strokeWidth={1.9}
                  className="shrink-0 text-green-600 transition-transform duration-300 group-hover/field:scale-110"
                />

                <div className="ml-3 min-w-0 flex-1 text-left">
                  <label
                    htmlFor="sport"
                    className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400"
                  >
                    Sport
                  </label>

                  <select
                    id="sport"
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-gray-800 outline-none"
                  >
                    <option value="">Any sport</option>
                    <option value="football">Football</option>
                    <option value="cricket">Cricket</option>
                    <option value="badminton">Badminton</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="group/button relative flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-green-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/25 active:translate-y-0"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Search
                    size={18}
                    strokeWidth={2.2}
                    className="transition-transform duration-300 group-hover/button:rotate-6"
                  />

                  Search
                </span>

                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover/button:translate-x-full" />
              </button>
            </div>
          </form>

          {/* Trust Points */}
          <div className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-medium text-gray-400 sm:text-sm">
            {[
              "Verified turfs",
              "Easy booking",
              "Secure payments",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 transition-colors duration-300 hover:text-gray-300"
              >
                <CheckCircle2
                  size={15}
                  strokeWidth={2}
                  className="text-green-500"
                />

                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mx-auto mt-14 max-w-3xl animate-[heroFadeUp_1000ms_ease-out] sm:mt-16">
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            {/* Turfs */}
            <div className="group px-3 py-5 text-center transition-colors duration-300 hover:bg-white/[0.03] sm:py-6">
              <div className="mx-auto flex w-fit items-center gap-1.5">
                <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  50+
                </p>

                <Sparkles
                  size={13}
                  className="text-green-500 opacity-0 transition-all duration-300 group-hover:opacity-100"
                />
              </div>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
                Turfs
              </p>
            </div>

            {/* Locations */}
            <div className="group border-x border-white/10 px-3 py-5 text-center transition-colors duration-300 hover:bg-white/[0.03] sm:py-6">
              <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                10+
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
                Locations
              </p>
            </div>

            {/* Bookings */}
            <div className="group px-3 py-5 text-center transition-colors duration-300 hover:bg-white/[0.03] sm:py-6">
              <div className="mx-auto flex w-fit items-center gap-1.5">
                <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  1000+
                </p>

                <ArrowUpRight
                  size={14}
                  className="text-green-500 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </div>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
                Bookings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-950 to-transparent"
        aria-hidden="true"
      />

      {/* Component Styles */}
      <style>{`
        .search-field {
          display: flex;
          min-height: 60px;
          align-items: center;
          border-radius: 1rem;
          background: #f9fafb;
          padding: 0.75rem 1rem;
          transition:
            background-color 200ms ease,
            box-shadow 200ms ease,
            transform 200ms ease;
        }

        .search-field:hover {
          background: #f3f4f6;
        }

        .search-field:focus-within {
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.14);
        }

        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -18px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;