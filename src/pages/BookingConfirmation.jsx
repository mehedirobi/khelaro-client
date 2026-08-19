import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { turfs } from "../data/turfs";

const BookingConfirmation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const date = searchParams.get("date");
  const slot = searchParams.get("slot");

  const turf = turfs.find((item) => item.id === id);

  if (!turf) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Turf not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The turf you are trying to book does not exist.
          </p>

          <Link
            to="/turfs"
            className="mt-5 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            Back to Turfs
          </Link>
        </div>
      </main>
    );
  }

  if (!date || !slot) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Booking information missing
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Please select a date and time slot before continuing.
          </p>

          <Link
            to={`/turfs/${turf.id}/book`}
            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Select Booking Time
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-BD",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const serviceFee = 50;
  const totalPrice = turf.price + serviceFee;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={`/turfs/${turf.id}/book`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft size={17} />
            Back to booking
          </Link>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <CheckCircle2 size={15} />
            Almost there
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Confirm your booking
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review your booking details before proceeding to payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Turf Information */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="h-56 overflow-hidden sm:h-64">
                <img
                  src={turf.image}
                  alt={turf.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {turf.sport}
                    </span>

                    <h2 className="mt-3 text-xl font-bold text-gray-900">
                      {turf.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="text-green-600" />
                      {turf.location}
                    </div>
                  </div>

                  <Link
                    to={`/turfs/${turf.id}`}
                    className="text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    View turf
                  </Link>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Booking details
              </h2>

              <div className="mt-6 space-y-5">
                {/* Date */}
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Booking date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Clock size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Selected time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {slot}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex gap-3">
                <ShieldCheck
                  size={21}
                  className="shrink-0 text-green-600"
                />

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Secure booking
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Your booking will be confirmed after successful
                    payment. Please arrive on time for your selected slot.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Price Summary */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Price summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Turf booking
                  </span>

                  <span className="font-medium text-gray-900">
                    ৳{turf.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Service fee
                  </span>

                  <span className="font-medium text-gray-900">
                    ৳{serviceFee}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-gray-900">
                      ৳{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <CreditCard size={18} />
                Proceed to Payment
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                By continuing, you agree to our booking and cancellation
                policy.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default BookingConfirmation;