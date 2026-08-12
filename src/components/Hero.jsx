import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  CalendarDays,
  Trophy,
  ArrowRight,
  CheckCircle2,
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

  return (
    <section className="relative overflow-hidden bg-gray-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-2 text-xs font-medium text-gray-300">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Find and book turfs across Dhaka
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Game.
            <br />
            <span className="text-green-500">Book Your Turf.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Discover the best sports turfs around Dhaka, check available
            slots, and book your game in just a few clicks.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-4xl rounded-2xl border border-gray-800 bg-white p-2 shadow-2xl sm:p-3"
          >
            <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto]">
              {/* Location */}
              <div className="flex items-center rounded-xl bg-gray-50 px-4">
                <MapPin size={19} className="shrink-0 text-green-600" />

                <div className="ml-3 flex-1 text-left">
                  <label
                    htmlFor="location"
                    className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                  >
                    Location
                  </label>

                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-sm font-medium text-gray-800 outline-none"
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
              <div className="flex items-center rounded-xl bg-gray-50 px-4">
                <CalendarDays
                  size={19}
                  className="shrink-0 text-green-600"
                />

                <div className="ml-3 flex-1 text-left">
                  <label
                    htmlFor="date"
                    className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                  >
                    Date
                  </label>

                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-sm font-medium text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* Sport */}
              <div className="flex items-center rounded-xl bg-gray-50 px-4">
                <Trophy size={19} className="shrink-0 text-green-600" />

                <div className="ml-3 flex-1 text-left">
                  <label
                    htmlFor="sport"
                    className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                  >
                    Sport
                  </label>

                  <select
                    id="sport"
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-sm font-medium text-gray-800 outline-none"
                  >
                    <option value="">Any sport</option>
                    <option value="football">Football</option>
                    <option value="cricket">Cricket</option>
                    <option value="badminton">Badminton</option>
                  </select>
                </div>
              </div>

              {/* Search */}
              <button
                type="submit"
                className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Trust points */}
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Verified turfs
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Easy booking
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Secure payments
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 border-y border-gray-800 py-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">50+</p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Turfs
            </p>
          </div>

          <div className="border-x border-gray-800 text-center">
            <p className="text-2xl font-bold text-white">10+</p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Locations
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-white">1000+</p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Bookings
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;