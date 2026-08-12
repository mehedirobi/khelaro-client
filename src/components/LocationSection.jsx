import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowUpRight,
  Building2,
  Users,
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
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Explore Dhaka
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Find a turf near you
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Explore popular areas and discover sports turfs close to
              where you play.
            </p>
          </div>

          <Link
            to="/turfs"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-green-600"
          >
            View all locations
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Locations */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link
              key={location.name}
              to={`/turfs?location=${location.name.toLowerCase()}`}
              className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg hover:shadow-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                  <MapPin size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {location.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {location.turfCount}
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={18}
                className="text-gray-300 transition group-hover:text-green-600"
              />
            </Link>
          ))}
        </div>

        {/* Small info */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <Building2 className="text-green-600" size={22} />

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Growing turf network
              </p>
              <p className="mt-1 text-xs text-gray-500">
                More verified venues are joining Khelaro.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <Users className="text-green-600" size={22} />

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Built for local players
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Find a convenient place for your next game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;