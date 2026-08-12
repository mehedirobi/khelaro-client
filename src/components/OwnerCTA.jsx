import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarRange,
  Store,
} from "lucide-react";

const OwnerCTA = () => {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gray-950">
          <div className="grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="text-sm font-semibold uppercase tracking-wider text-green-400">
                For turf owners
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Turn your turf into a smarter business.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
                List your venue on Khelaro, manage bookings, control
                availability and keep track of your business from one
                place.
              </p>

              <Link
                to="/register?role=owner"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                List your turf
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Feature cards */}
            <div className="grid gap-4 bg-gray-900 p-8 sm:grid-cols-3 lg:grid-cols-1 lg:p-12">
              <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                <Store size={21} className="text-green-500" />

                <p className="mt-4 text-sm font-semibold text-white">
                  Manage your turf
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Keep your venue information and pricing updated.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                <CalendarRange size={21} className="text-green-500" />

                <p className="mt-4 text-sm font-semibold text-white">
                  Manage bookings
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Control available slots and manage customer bookings.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                <BarChart3 size={21} className="text-green-500" />

                <p className="mt-4 text-sm font-semibold text-white">
                  Track performance
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Monitor bookings and revenue from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnerCTA;