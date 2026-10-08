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
  ChevronRight,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const normalizeIdentifier = (value) =>
  decodeURIComponent(String(value || ""))
    .trim()
    .toLowerCase();

const getTurfIdentifier = (turf) => {
  return String(
    turf?._id ||
      turf?.id ||
      turf?.slug ||
      ""
  ).trim();
};

const getTurfList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.turfs)) {
    return data.turfs;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const BookingConfirmation = () => {
  const { id, turfId } = useParams();
  const [searchParams] = useSearchParams();

  const date = searchParams.get("date");
  const slot = searchParams.get("slot");

  const routeIdentifier = normalizeIdentifier(
    turfId || id
  );

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  /*
   * Load turf from MongoDB.
   */
  useEffect(() => {
    const controller = new AbortController();

    const loadTurf = async () => {
      if (!routeIdentifier) {
        setTurf(null);
        setError("Invalid turf ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setTurf(null);
        setImageLoaded(false);

        const response = await fetch(`${API_URL}/turfs`, {
          method: "GET",
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Failed to load turfs."
          );
        }

        const turfList = getTurfList(data);

        if (!turfList.length) {
          throw new Error(
            "No turf data was found in the database."
          );
        }

        const foundTurf = turfList.find((item) => {
          const mongoId = normalizeIdentifier(item?._id);
          const customId = normalizeIdentifier(item?.id);
          const slug = normalizeIdentifier(item?.slug);

          return (
            mongoId === routeIdentifier ||
            customId === routeIdentifier ||
            slug === routeIdentifier
          );
        });

        if (!foundTurf) {
          throw new Error(
            "Turf not found in the database."
          );
        }

        if (!getTurfIdentifier(foundTurf)) {
          throw new Error(
            "The selected turf does not have a valid ID."
          );
        }

        setTurf(foundTurf);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(
          "Failed to load turf:",
          err
        );

        setTurf(null);
        setError(
          err?.message ||
            "Failed to load turf."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadTurf();

    return () => controller.abort();
  }, [routeIdentifier, retryKey]);

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="animate-[fadeUp_0.45s_ease-out_both] text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
            <Loader2
              size={28}
              className="animate-spin text-green-600"
            />
          </div>

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

  /*
   * Turf loading error.
   */
  if (!turf) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md animate-[fadeUp_0.5s_ease-out_both] text-center">
          <div className="mx-auto flex h-16 w-16 animate-[popIn_0.45s_ease-out_both] items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle
              size={28}
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

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setRetryKey((current) => current + 1)
              }
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 active:scale-[0.98]"
            >
              <RefreshCw
                size={16}
                className="transition-transform duration-500 group-hover:rotate-180"
              />
              Try again
            </button>

            <Link
              to="/turfs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 active:scale-[0.98]"
            >
              <ArrowLeft size={17} />
              Back to Turfs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Use MongoDB _id as the main booking identifier.
   */
  const mongoTurfId = String(
    turf._id || ""
  ).trim();

  const turfRouteId = String(
    turf._id ||
      turf.id ||
      turf.slug ||
      routeIdentifier ||
      ""
  ).trim();

  /*
   * Booking information missing.
   */
  if (!date || !slot) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md animate-[fadeUp_0.5s_ease-out_both] rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 animate-[popIn_0.45s_ease-out_both] items-center justify-center rounded-2xl bg-yellow-50">
            <CalendarDays
              size={27}
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
            to={`/turfs/${encodeURIComponent(
              turfRouteId
            )}/book`}
            className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md active:scale-[0.98]"
          >
            <CalendarDays size={17} />
            Select Booking Time

            <ChevronRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </main>
    );
  }

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
    Number.isFinite(priceValue) &&
    priceValue >= 0
      ? priceValue
      : 0;

  const serviceFee = 50;
  const totalPrice = turfPrice + serviceFee;

  const formattedDate = new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /*
   * Back to booking page.
   */
  const bookingUrl = `/turfs/${encodeURIComponent(
    turfRouteId
  )}/book`;

  /*
   * Payment page uses MongoDB _id.
   */
  const paymentParams = new URLSearchParams({
    date,
    slot,
    amount: String(totalPrice),
    turfId: mongoTurfId,
    turfName,
    turfImage,
    turfLocation,
    turfSport,
    turfPrice: String(turfPrice),
    serviceFee: String(serviceFee),
  });

  const paymentUrl = `/payment/${encodeURIComponent(
    mongoTurfId
  )}?${paymentParams.toString()}`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={bookingUrl}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-green-600"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            Back to booking
          </Link>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Heading */}
        <div className="mb-8 animate-[fadeUp_0.55s_ease-out_both]">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <CheckCircle2
              size={15}
              className="animate-[checkPop_0.5s_ease-out_0.2s_both]"
            />

            Almost there
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Confirm your booking
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            Review your booking details before proceeding
            to payment.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Left */}
          <div className="space-y-6">
            {/* Turf card */}
            <div className="group animate-[fadeUp_0.6s_ease-out_0.08s_both] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative h-56 overflow-hidden bg-gray-100 sm:h-64">
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gray-200">
                    <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>
                )}

                <img
                  src={turfImage}
                  alt={turfName}
                  loading="eager"
                  onLoad={() =>
                    setImageLoaded(true)
                  }
                  onError={(event) => {
                    if (
                      event.currentTarget.src !==
                      FALLBACK_IMAGE
                    ) {
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }

                    setImageLoaded(true);
                  }}
                  className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.02] ${
                    imageLoaded
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-70" />

                <div className="absolute left-4 top-4">
                  <span className="inline-flex rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm backdrop-blur-sm">
                    {turfSport}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {turfName}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin
                        size={16}
                        className="shrink-0 text-green-600"
                      />

                      <span>
                        {turfLocation}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/turfs/${encodeURIComponent(
                      turfRouteId
                    )}`}
                    className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-green-600 transition-colors duration-200 hover:text-green-700"
                  >
                    View turf

                    <ChevronRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Booking details */}
            <div className="animate-[fadeUp_0.6s_ease-out_0.16s_both] rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Booking details
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:border-green-100 hover:bg-green-50/40">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-transform duration-300 group-hover:scale-105">
                    <CalendarDays size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400">
                      Booking date
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-5 text-gray-900">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:border-green-100 hover:bg-green-50/40">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-transform duration-300 group-hover:scale-105">
                    <Clock size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Selected time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {slot}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="animate-[fadeUp_0.6s_ease-out_0.24s_both] rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                  <ShieldCheck size={20} />
                </div>

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

          {/* Right */}
          <aside className="animate-[fadeUp_0.6s_ease-out_0.18s_both]">
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Price summary
                  </h2>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <CreditCard size={17} />
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      Turf booking
                    </span>

                    <span className="font-medium text-gray-900">
                      ৳
                      {turfPrice.toLocaleString(
                        "en-BD"
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      Service fee
                    </span>

                    <span className="font-medium text-gray-900">
                      ৳
                      {serviceFee.toLocaleString(
                        "en-BD"
                      )}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-4">
                    <div className="flex items-end justify-between gap-4">
                      <span className="font-semibold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold tracking-tight text-gray-900">
                        ৳
                        {totalPrice.toLocaleString(
                          "en-BD"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={paymentUrl}
                  className="group mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white shadow-sm shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 focus:outline-none focus:ring-4 focus:ring-green-500/20 active:scale-[0.98]"
                >
                  <CreditCard
                    size={18}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                  />

                  Proceed to Payment

                  <ChevronRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>

                <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-gray-400">
                  <ShieldCheck
                    size={14}
                    className="mt-0.5 shrink-0"
                  />

                  <p>
                    Your booking details are securely
                    prepared for the next payment step.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3.5 sm:px-6">
                <p className="text-center text-xs leading-5 text-gray-400">
                  By continuing, you agree to our booking
                  and cancellation policy.
                </p>
              </div>
            </div>
          </aside>
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

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.75);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkPop {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }

          70% {
            transform: scale(1.15);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(100%);
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

export default BookingConfirmation;