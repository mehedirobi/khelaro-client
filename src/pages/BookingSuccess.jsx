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
} from "lucide-react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { turfs } from "../data/turfs";

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const BookingSuccess = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const date = searchParams.get("date")?.trim() || "";
  const slot = searchParams.get("slot")?.trim() || "";
  const method = searchParams.get("method")?.trim().toLowerCase() || "";
  const bookingId =
    searchParams.get("bookingId")?.trim() ||
    searchParams.get("booking")?.trim() ||
    "";

  const paymentAmount = searchParams.get("amount");

  // =========================
  // FIND TURF FROM LOCAL DATA
  // =========================

  useEffect(() => {
    const findTurf = () => {
      try {
        const turfId = decodeURIComponent(
          String(id || "")
        ).trim();

        if (!turfId) {
          setError("Invalid turf ID.");
          setLoading(false);
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
          setError("Turf not found.");
          setLoading(false);
          return;
        }

        setTurf(foundTurf);
        setLoading(false);
      } catch (err) {
        console.error("Turf loading error:", err);

        setError("Failed to load turf information.");
        setLoading(false);
      }
    };

    findTurf();
  }, [id]);

  // =========================
  // PARSE SLOT
  // =========================

  const parsedSlot = useMemo(() => {
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
  }, [slot]);

  // =========================
  // FORMAT DATE
  // =========================

  const formattedDate = useMemo(() => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [date]);

  // =========================
  // PAYMENT METHOD
  // =========================

  const paymentMethod = useMemo(() => {
    switch (method) {
      case "bkash":
        return "bKash";

      case "nagad":
        return "Nagad";

      case "card":
        return "Card Payment";

      case "online":
        return "Online Payment";

      default:
        return method
          ? method.charAt(0).toUpperCase() + method.slice(1)
          : "Online Payment";
    }
  }, [method]);

  // =========================
  // TURF DATA
  // =========================

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

  // =========================
  // PRICE
  // =========================

  const safePrice = useMemo(() => {
    const urlAmount = Number(paymentAmount);

    if (
      Number.isFinite(urlAmount) &&
      urlAmount >= 0
    ) {
      return urlAmount;
    }

    const turfPrice = Number(turf?.price);

    if (
      Number.isFinite(turfPrice) &&
      turfPrice >= 0
    ) {
      return turfPrice;
    }

    return 0;
  }, [paymentAmount, turf?.price]);

  // =========================
  // BOOKING REFERENCE
  // =========================

  const bookingReference = useMemo(() => {
    if (bookingId) {
      return `KHL-${String(bookingId)
        .slice(-8)
        .toUpperCase()}`;
    }

    const fallbackId =
      turf?.id ||
      id ||
      "BOOKING";

    return `KHL-${String(fallbackId)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(-8)
      .toUpperCase()}`;
  }, [bookingId, turf?.id, id]);

  // =========================
  // VALIDATE BOOKING INFO
  // =========================

  const missingInformation = useMemo(() => {
    const missing = [];

    if (!date) {
      missing.push("booking date");
    }

    if (!slot) {
      missing.push("time slot");
    }

    return missing;
  }, [date, slot]);

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

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Loading booking...
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we load your booking information.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !turf) {
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
            Booking information unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error || "Turf information could not be loaded."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/turfs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Explore Turfs
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/dashboard/bookings"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-500 hover:text-green-600"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // MISSING PAYMENT INFO
  // =========================

  if (missingInformation.length > 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <AlertCircle
              size={26}
              className="text-amber-500"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Payment information missing
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Some booking information was not passed to
            the payment success page.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Missing: {missingInformation.join(", ")}.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to={`/turfs/${turf.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Back to Turf
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/turfs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-500 hover:text-green-600"
            >
              Explore Turfs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* SUCCESS HEADER */}
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
            Your payment was successful and your booking
            information has been confirmed.
          </p>
        </div>

        {/* TURF + BOOKING */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* TURF */}
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
            <img
              src={turfImage}
              alt={turfName}
              className="h-28 w-full rounded-xl object-cover sm:w-40"
              onError={(event) => {
                event.currentTarget.src =
                  FALLBACK_IMAGE;
              }}
            />

            <div className="flex-1">
              <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {turfSport}
              </span>

              <h2 className="mt-3 text-xl font-bold text-gray-900">
                {turfName}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin
                  size={16}
                  className="text-green-600"
                />

                <span>{turfLocation}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* BOOKING DETAILS */}
          <div className="p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900">
              <ReceiptText
                size={19}
                className="text-green-600"
              />

              Booking Details
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* DATE */}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
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

              {/* TIME */}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                    <Clock size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Time Slot
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {slot}
                    </p>

                    {parsedSlot.startTime &&
                      parsedSlot.endTime && (
                        <p className="mt-1 text-xs text-gray-400">
                          {parsedSlot.startTime} -{" "}
                          {parsedSlot.endTime}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
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

              {/* TOTAL */}
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs text-green-700">
                  Total Paid
                </p>

                <p className="mt-2 text-2xl font-bold text-green-700">
                  ৳
                  {safePrice.toLocaleString("en-BD")}
                </p>

                <p className="mt-1 text-xs text-green-600">
                  Payment completed successfully
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* REFERENCE */}
          <div className="flex flex-col gap-2 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="text-sm text-gray-500">
              Booking reference
            </span>

            <span className="font-mono text-sm font-semibold text-gray-900">
              {bookingReference}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
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
          Your booking information has been saved to
          your Khelaro account.
        </p>
      </div>
    </main>
  );
};

export default BookingSuccess;