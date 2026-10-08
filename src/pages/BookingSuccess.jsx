import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CalendarDays,
  Clock,
  CreditCard,
  MapPin,
  ArrowRight,
  Home,
  ReceiptText,
  Loader2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const formatDate = (date) => {
  if (!date) return "Not available";

  const value = String(date).trim();

  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) return value;

  const [, year, month, day] = match;

  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatPaymentMethod = (method) => {
  const value = String(method || "")
    .trim()
    .toLowerCase();

  const methods = {
    bkash: "bKash",
    nagad: "Nagad",
    card: "Card Payment",
    online: "Online Payment",
    cash: "Cash Payment",
  };

  return (
    methods[value] ||
    (value
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : "Online Payment")
  );
};

const parseSlot = (slot) => {
  if (!slot) {
    return {
      startTime: "",
      endTime: "",
    };
  }

  const parts = String(slot)
    .split(/\s*(?:-|–|—|to)\s*/i)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    startTime: parts[0] || "",
    endTime: parts[1] || "",
  };
};

const getBookingReference = (
  bookingId,
  turfId
) => {
  if (bookingId) {
    return `KHL-${String(bookingId)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(-8)
      .toUpperCase()}`;
  }

  return `KHL-${String(turfId || "BOOKING")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-8)
    .toUpperCase()}`;
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

const getBackendTurf = (data) => {
  if (data?.turf) {
    return data.turf;
  }

  if (data?.data && !Array.isArray(data.data)) {
    return data.data;
  }

  if (data?._id || data?.id || data?.slug) {
    return data;
  }

  return null;
};

const getBackendBooking = (data) => {
  if (data?.booking) {
    return data.booking;
  }

  if (data?.data && !Array.isArray(data.data)) {
    return data.data;
  }

  if (
    data?._id ||
    data?.id ||
    data?.bookingId
  ) {
    return data;
  }

  return null;
};

const BookingSuccess = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [turf, setTurf] = useState(null);
  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [retryKey, setRetryKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const queryDate =
    searchParams.get("date")?.trim() || "";

  const querySlot =
    searchParams.get("slot")?.trim() || "";

  const queryMethod =
    searchParams.get("method")?.trim() || "";

  const queryBookingId =
    searchParams.get("bookingId")?.trim() ||
    searchParams.get("booking")?.trim() ||
    "";

  const queryAmount =
    searchParams.get("amount")?.trim() || "";

  /*
   * Load turf and booking data from MongoDB.
   */
  useEffect(() => {
    const controller = new AbortController();

    const loadBookingData = async () => {
      setLoading(true);
      setError("");

      try {
        const turfIdentifier = decodeURIComponent(
          String(id || "")
        ).trim();

        if (!turfIdentifier) {
          throw new Error("Invalid turf ID.");
        }

        /*
         * Load all turfs from backend.
         *
         * This avoids depending on:
         * GET /turfs/:id
         *
         * which may not exist in the current backend.
         */
        const turfResponse = await fetch(
          `${API_URL}/turfs`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        const turfData =
          await turfResponse
            .json()
            .catch(() => ({}));

        if (!turfResponse.ok) {
          throw new Error(
            turfData?.message ||
              turfData?.error ||
              "Unable to load turfs."
          );
        }

        const turfList =
          getTurfList(turfData);

        const normalizedIdentifier =
          turfIdentifier.toLowerCase();

        const foundTurf =
          turfList.find((item) => {
            const mongoId = String(
              item?._id || ""
            )
              .trim()
              .toLowerCase();

            const customId = String(
              item?.id || ""
            )
              .trim()
              .toLowerCase();

            const slug = String(
              item?.slug || ""
            )
              .trim()
              .toLowerCase();

            return (
              mongoId ===
                normalizedIdentifier ||
              customId ===
                normalizedIdentifier ||
              slug ===
                normalizedIdentifier
            );
          });

        if (!foundTurf) {
          throw new Error(
            "Turf not found."
          );
        }

        setTurf(foundTurf);

        /*
         * Load booking details if booking ID
         * exists in the URL.
         */
        if (queryBookingId) {
          try {
            const bookingResponse =
              await fetch(
                `${API_URL}/bookings/${encodeURIComponent(
                  queryBookingId
                )}`,
                {
                  method: "GET",
                  signal:
                    controller.signal,
                }
              );

            const bookingData =
              await bookingResponse
                .json()
                .catch(() => ({}));

            if (bookingResponse.ok) {
              const backendBooking =
                getBackendBooking(
                  bookingData
                );

              if (backendBooking) {
                setBooking(
                  backendBooking
                );
              }
            }
          } catch (bookingError) {
            if (
              bookingError?.name !==
              "AbortError"
            ) {
              console.warn(
                "Booking details could not be loaded:",
                bookingError
              );
            }
          }
        }
      } catch (err) {
        if (
          err?.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Booking success error:",
          err
        );

        setTurf(null);

        setError(
          err?.message ||
            "Unable to load booking information."
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    };

    loadBookingData();

    return () => {
      controller.abort();
    };
  }, [
    id,
    queryBookingId,
    retryKey,
  ]);

  /*
   * Backend booking data has priority.
   * URL data works as fallback.
   */
  const bookingDate =
    booking?.date ||
    booking?.bookingDate ||
    queryDate;

  const bookingSlot =
    booking?.slot ||
    booking?.timeSlot ||
    querySlot;

  const bookingMethod =
    booking?.paymentMethod ||
    booking?.method ||
    queryMethod;

  const bookingId =
    booking?._id ||
    booking?.id ||
    booking?.bookingId ||
    queryBookingId;

  /*
   * Payment amount priority:
   *
   * booking amount
   * -> URL amount
   * -> turf price
   */
  const paymentAmount = useMemo(() => {
    const values = [
      booking?.totalAmount,
      booking?.amount,
      booking?.price,
      booking?.total,
      queryAmount,
      turf?.price,
    ];

    for (const value of values) {
      const number = Number(value);

      if (
        Number.isFinite(number) &&
        number >= 0
      ) {
        return number;
      }
    }

    return 0;
  }, [
    booking,
    queryAmount,
    turf?.price,
  ]);

  const parsedSlot = useMemo(
    () => parseSlot(bookingSlot),
    [bookingSlot]
  );

  const formattedBookingDate =
    useMemo(
      () => formatDate(bookingDate),
      [bookingDate]
    );

  const paymentMethod = useMemo(
    () =>
      formatPaymentMethod(
        bookingMethod
      ),
    [bookingMethod]
  );

  const bookingReference = useMemo(
    () =>
      getBookingReference(
        bookingId,
        turf?._id ||
          turf?.id ||
          id
      ),
    [bookingId, turf, id]
  );

  const turfName = String(
    turf?.name || "Unnamed Turf"
  ).trim();

  const turfImage =
    typeof turf?.image === "string" &&
    turf.image.trim()
      ? turf.image.trim()
      : FALLBACK_IMAGE;

  const turfSport = String(
    turf?.sport || "Sports Turf"
  ).trim();

  const turfLocation = String(
    turf?.location ||
      turf?.area ||
      "Dhaka, Bangladesh"
  ).trim();

  const missingInformation = [];

  if (!bookingDate) {
    missingInformation.push(
      "booking date"
    );
  }

  if (!bookingSlot) {
    missingInformation.push(
      "time slot"
    );
  }

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(
        bookingReference
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(
        "Failed to copy reference:",
        error
      );
    }
  };

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center animate-[fadeUp_.5s_ease-out_both]">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-60" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-green-100">
              <Loader2
                size={28}
                className="animate-spin text-green-600"
              />
            </div>
          </div>

          <h1 className="mt-6 text-xl font-bold text-gray-900">
            Loading your booking
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please wait while we prepare
            your booking confirmation.
          </p>

          <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-green-500" />
          </div>
        </div>
      </main>
    );
  }

  /*
   * Turf loading error.
   */
  if (error || !turf) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md animate-[fadeUp_.5s_ease-out_both] rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm sm:p-9">
          <div className="mx-auto flex h-16 w-16 animate-[popIn_.45s_ease-out_both] items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle
              size={30}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Unable to load turf
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "Turf information could not be loaded from the server."}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setRetryKey(
                  (value) => value + 1
                )
              }
              className="group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 active:scale-[0.98]"
            >
              <RefreshCw
                size={16}
                className="transition-transform duration-500 group-hover:rotate-180"
              />
              Try again
            </button>

            <Link
              to="/turfs"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 active:scale-[0.98]"
            >
              Explore Turfs
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Missing booking information.
   */
  if (
    missingInformation.length > 0
  ) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md animate-[fadeUp_.5s_ease-out_both] rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm sm:p-9">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
            <AlertCircle
              size={30}
              className="text-amber-500"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Booking information incomplete
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Some information required to
            display your booking is missing.
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Missing:{" "}
            {missingInformation.join(
              ", "
            )}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              to="/dashboard/bookings"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700"
            >
              View My Bookings
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/turfs"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-green-500 hover:text-green-600"
            >
              Explore Turfs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Success hero */}
        <section className="relative overflow-hidden rounded-3xl border border-green-100 bg-white px-6 py-10 text-center shadow-sm animate-[fadeUp_.6s_ease-out_both] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-100/70 blur-3xl" />

          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-[successPulse_2s_ease-out_infinite] rounded-full bg-green-100" />

            <div className="relative flex h-20 w-20 animate-[popIn_.55s_cubic-bezier(.2,.8,.2,1)_both] items-center justify-center rounded-full bg-green-50 ring-8 ring-white shadow-sm">
              <CheckCircle2
                size={48}
                strokeWidth={1.8}
                className="animate-[checkDraw_.7s_ease-out_.25s_both] text-green-600"
              />
            </div>
          </div>

          <p className="relative mt-7 text-xs font-bold uppercase tracking-[0.2em] text-green-600">
            Payment successful
          </p>

          <h1 className="relative mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Booking confirmed
          </h1>

          <p className="relative mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Your turf has been successfully
            reserved. Your booking details
            are ready below.
          </p>

          <div className="relative mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
            <CheckCircle2 size={14} />
            Reservation secured
          </div>
        </section>

        {/* Main booking card */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm animate-[fadeUp_.6s_ease-out_.12s_both]">
          {/* Turf */}
          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="group relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-32 sm:w-48">
                <img
                  src={turfImage}
                  alt={turfName}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(event) => {
                    if (
                      event.currentTarget
                        .src !==
                      FALLBACK_IMAGE
                    ) {
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-green-700 shadow-sm backdrop-blur-sm">
                  {turfSport}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Turf
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {turfName}
                </h2>

                <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <span>
                    {turfLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Details */}
          <div className="p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <ReceiptText size={18} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Booking details
                </h3>

                <p className="text-xs text-gray-400">
                  Your confirmed reservation
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Date */}
              <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <CalendarDays size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400">
                      Booking date
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-5 text-gray-900">
                      {formattedBookingDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Clock size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400">
                      Time slot
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {bookingSlot}
                    </p>

                    {parsedSlot.startTime &&
                      parsedSlot.endTime && (
                        <p className="mt-1 text-xs text-gray-400">
                          {
                            parsedSlot.startTime
                          }{" "}
                          -{" "}
                          {
                            parsedSlot.endTime
                          }
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <CreditCard size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Payment method
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4 transition-all duration-300 hover:-translate-y-1">
                <p className="text-xs font-medium text-green-700">
                  Total paid
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-green-700">
                  ৳
                  {paymentAmount.toLocaleString(
                    "en-BD"
                  )}
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-green-600">
                  <CheckCircle2 size={13} />
                  Payment completed
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Reference */}
          <div className="flex flex-col gap-3 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-xs font-medium text-gray-400">
                Booking reference
              </p>

              <p className="mt-1 font-mono text-sm font-bold tracking-wide text-gray-900">
                {bookingReference}
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleCopyReference
              }
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition-all duration-200 hover:border-green-300 hover:text-green-600 active:scale-95"
            >
              {copied ? (
                <>
                  <Check
                    size={14}
                    className="text-green-600"
                  />
                  Copied
                </>
              ) : (
                <>
                  <Copy
                    size={14}
                    className="transition-transform group-hover:scale-110"
                  />
                  Copy reference
                </>
              )}
            </button>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 animate-[fadeUp_.6s_ease-out_.22s_both]">
          <Link
            to="/dashboard/bookings"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white shadow-sm shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 active:scale-[0.98]"
          >
            View my bookings
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-400 hover:text-green-600 hover:shadow-sm active:scale-[0.98]"
          >
            <Home
              size={17}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            Back to home
          </Link>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs leading-5 text-gray-400 animate-[fadeIn_.8s_ease-out_.35s_both]">
          <ShieldIcon />
          <span>
            Your booking information has been
            securely saved to your Khelaro
            account.
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.65);
          }

          70% {
            transform: scale(1.08);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes successPulse {
          0% {
            opacity: 0.7;
            transform: scale(0.85);
          }

          70% {
            opacity: 0;
            transform: scale(1.35);
          }

          100% {
            opacity: 0;
            transform: scale(1.35);
          }
        }

        @keyframes checkDraw {
          from {
            opacity: 0;
            transform: scale(0.6) rotate(-8deg);
          }

          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(200%);
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

const ShieldIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default BookingSuccess;