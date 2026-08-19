import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Star,
  Users,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { turfs } from "../data/turfs";
import BookingSection from "../pages/BookingSection";

const TurfDetails = () => {
  const { turfId } = useParams();

  const turf = turfs.find((item) => item.id === turfId);

  if (!turf) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Turf not found
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            The turf you are looking for does not exist.
          </p>

          <Link
            to="/turfs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
          >
            <ArrowLeft size={17} />
            Back to Turfs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      {/* Breadcrumb */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/turfs"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft size={16} />
            Back to all turfs
          </Link>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Left */}
          <div>
            {/* Image */}
            <div className="overflow-hidden rounded-2xl bg-gray-200">
              <img
                src={turf.image}
                alt={turf.name}
                className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[470px]"
              />
            </div>

            {/* Information */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {turf.sport}
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {turf.name}
                  </h1>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin
                      size={17}
                      className="shrink-0 text-green-600"
                    />

                    {turf.location}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="font-semibold text-gray-900">
                    {turf.rating}
                  </span>

                  <span className="text-sm text-gray-400">
                    ({turf.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="my-7 h-px bg-gray-100" />

              <h2 className="text-lg font-semibold text-gray-900">
                About this turf
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                {turf.description}
              </p>

              {/* Turf specs */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4">
                  <Users size={19} className="text-green-600" />

                  <p className="mt-3 text-xs text-gray-400">
                    Turf Size
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {turf.size}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <ShieldCheck size={19} className="text-green-600" />

                  <p className="mt-3 text-xs text-gray-400">
                    Surface
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {turf.surface}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <Clock3 size={19} className="text-green-600" />

                  <p className="mt-3 text-xs text-gray-400">
                    Opening Hours
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {turf.openingTime}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  Amenities
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {turf.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2
                        size={17}
                        className="shrink-0 text-green-600"
                      />

                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Starting from
                  </p>

                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ৳{turf.price}
                    </span>

                    <span className="text-sm text-gray-400">
                      / hour
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5">
                  <Star
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="text-sm font-semibold text-green-700">
                    {turf.rating}
                  </span>
                </div>
              </div>

              <div className="my-6 h-px bg-gray-100" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Availability
                    </p>

                    <Link
  to={`/turfs/${turf.id}/slots`}
  className="text-sm font-medium text-gray-900 transition hover:text-green-600"
>
  Check available slots
</Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <Clock3 size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Opening Hours
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {turf.openingTime} - {turf.closingTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Location
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {turf.area}, Dhaka
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to={`/turfs/${turf.id}/book`}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-500"
              >
                Check Availability
                <ArrowRight size={17} />
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                Select your preferred date and time to see available
                slots.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TurfDetails;