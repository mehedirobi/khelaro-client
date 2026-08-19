import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  CalendarDays,
  Clock,
  CreditCard,
  MapPin,
  ArrowRight,
  Home,
  ReceiptText,
} from "lucide-react";
import { turfs } from "../data/turfs";

const BookingSuccess = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const date = searchParams.get("date");
  const slot = searchParams.get("slot");
  const method = searchParams.get("method");

  const turf = turfs.find((item) => item.id === id);

  if (!turf) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Booking not found
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            We could not find the booking information.
          </p>

          <Link
            to="/turfs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Explore Turfs
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not selected";

  const paymentMethod =
    method === "bkash"
      ? "bKash"
      : method === "nagad"
      ? "Nagad"
      : method === "card"
      ? "Card Payment"
      : "Online Payment";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Success Header */}
        <div className="rounded-2xl border border-green-100 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2
              size={44}
              className="text-green-600"
            />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-600">
            Payment Successful
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Booking Confirmed!
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
            Your booking has been successfully confirmed. Get ready
            for your game!
          </p>
        </div>

        {/* Booking Details */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Turf */}
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
            <img
              src={turf.image}
              alt={turf.name}
              className="h-28 w-full rounded-xl object-cover sm:w-40"
            />

            <div className="flex-1">
              <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {turf.sport}
              </span>

              <h2 className="mt-3 text-xl font-bold text-gray-900">
                {turf.name}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin
                  size={16}
                  className="text-green-600"
                />
                {turf.location}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Booking Info */}
          <div className="p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900">
              <ReceiptText
                size={19}
                className="text-green-600"
              />
              Booking Details
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Date */}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Booking Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                    <Clock size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Time Slot
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {slot || "Not selected"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                    <CreditCard size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Payment Method
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs text-green-700">
                  Total Paid
                </p>

                <p className="mt-2 text-2xl font-bold text-green-700">
                  ৳{turf.price.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-green-600">
                  1 hour booking
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Booking ID */}
          <div className="flex flex-col gap-2 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="text-sm text-gray-500">
              Booking reference
            </span>

            <span className="font-mono text-sm font-semibold text-gray-900">
              KHL-{turf.id.toUpperCase()}-{Date.now().toString().slice(-6)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/dashboard/bookings"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            View My Bookings
            <ArrowRight size={17} />
          </Link>

          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-green-500 hover:text-green-600"
          >
            <Home size={17} />
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          A booking confirmation has been generated for your selected
          turf and time slot.
        </p>
      </div>
    </main>
  );
};

export default BookingSuccess;