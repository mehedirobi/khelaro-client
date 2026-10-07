import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { turfs } from "../data/turfs";

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const BookingConfirmation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const date = searchParams.get("date");
  const slot = searchParams.get("slot");

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD LOCAL TURF
  // =========================

  useEffect(() => {
    const loadTurf = () => {
      try {
        setLoading(true);
        setError("");

        const turfId = decodeURIComponent(
          String(id || "")
        ).trim();

        if (!turfId) {
          setError("Invalid turf ID.");
          setTurf(null);
          return;
        }

        const foundTurf = turfs.find((item) => {
          const itemId = String(item.id || "").trim();
          const itemSlug = String(item.slug || "").trim();

          return (
            itemId === turfId ||
            itemSlug === turfId
          );
        });

        if (!foundTurf) {
          setTurf(null);
          setError("Turf not found.");
          return;
        }

        setTurf(foundTurf);
      } catch (error) {
        console.error("Failed to load turf:", error);

        setTurf(null);
        setError(
          error?.message || "Failed to load turf."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTurf();
  }, [id]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-green-600"
          />

          <h1 className="mt-5 text-xl font-semibold text-gray-900">
            Loading booking...
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we load the turf details.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // TURF NOT FOUND
  // =========================

  if (!turf) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle
              size={26}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Unable to load turf
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "The requested turf could not be found."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <RefreshCw size={16} />
              Try again
            </button>

            <Link
              to="/turfs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <ArrowLeft size={17} />
              Back to Turfs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // TURF ID
  // =========================

  const turfId = String(
    turf.id || turf.slug || id || ""
  ).trim();

  // =========================
  // BOOKING INFO CHECK
  // =========================

  if (!date || !slot) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50">
            <CalendarDays
              size={26}
              className="text-yellow-600"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Booking information missing
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Please select a date and time slot before
            continuing.
          </p>

          <Link
            to={`/turfs/${encodeURIComponent(turfId)}/book`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <CalendarDays size={17} />
            Select Booking Time
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // TURF DATA
  // =========================

  const turfName = String(
    turf.name || "Unnamed Turf"
  ).trim();

  const turfImage =
    typeof turf.image === "string" &&
    turf.image.trim()
      ? turf.image.trim()
      : FALLBACK_IMAGE;

  const turfLocation = String(
    turf.location ||
      turf.area ||
      "Dhaka, Bangladesh"
  ).trim();

  const turfSport = String(
    turf.sport || "Sports Turf"
  ).trim();

  const priceValue = Number(turf.price);

  const turfPrice =
    Number.isFinite(priceValue) && priceValue >= 0
      ? priceValue
      : 0;

  const serviceFee = 50;
  const totalPrice = turfPrice + serviceFee;

  // =========================
  // DATE
  // =========================

  const formattedDate = new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // =========================
  // ROUTES
  // =========================

  const bookingUrl = `/turfs/${encodeURIComponent(
    turfId
  )}/book`;

  /*
   * Send all required booking/payment information.
   * Payment page can use these values directly.
   */

  const paymentParams = new URLSearchParams({
    date,
    slot,
    amount: String(totalPrice),
    turfId,
    turfName,
    turfImage,
    turfLocation,
    turfSport,
    turfPrice: String(turfPrice),
    serviceFee: String(serviceFee),
  });

  const paymentUrl = `/payment/${encodeURIComponent(
    turfId
  )}?${paymentParams.toString()}`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={bookingUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft size={17} />
            Back to booking
          </Link>
        </div>
      </section>

      {/* CONTENT */}
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
            Review your booking details before proceeding
            to payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* TURF CARD */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="h-56 overflow-hidden sm:h-64">
                <img
                  src={turfImage}
                  alt={turfName}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    if (
                      event.currentTarget.src !==
                      FALLBACK_IMAGE
                    ) {
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }
                  }}
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {turfSport}
                    </span>

                    <h2 className="mt-3 text-xl font-bold text-gray-900">
                      {turfName}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin
                        size={16}
                        className="text-green-600"
                      />
                      {turfLocation}
                    </div>
                  </div>

                  <Link
                    to={`/turfs/${encodeURIComponent(
                      turfId
                    )}`}
                    className="text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    View turf
                  </Link>
                </div>
              </div>
            </div>

            {/* BOOKING DETAILS */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Booking details
              </h2>

              <div className="mt-6 space-y-5">
                {/* DATE */}
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

                {/* TIME */}
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

            {/* SECURITY */}
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
                    Your booking will be confirmed after
                    successful payment. Please arrive on
                    time for your selected slot.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Price summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                {/* TURF PRICE */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Turf booking
                  </span>

                  <span className="font-medium text-gray-900">
                    ৳{turfPrice.toLocaleString("en-BD")}
                  </span>
                </div>

                {/* SERVICE FEE */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Service fee
                  </span>

                  <span className="font-medium text-gray-900">
                    ৳{serviceFee.toLocaleString("en-BD")}
                  </span>
                </div>

                {/* TOTAL */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-gray-900">
                      ৳{totalPrice.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </div>

              {/* PAYMENT */}
              <Link
                to={paymentUrl}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <CreditCard size={18} />
                Proceed to Payment
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                By continuing, you agree to our booking and
                cancellation policy.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default BookingConfirmation;