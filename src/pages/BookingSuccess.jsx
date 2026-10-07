import { useEffect, useState } from "react";
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
import useAuth from "../hooks/useAuth";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const BookingSuccess = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  const date = searchParams.get("date");
  const slot = searchParams.get("slot");
  const method = searchParams.get("method");

  const [turf, setTurf] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingCreating, setBookingCreating] =
    useState(false);
  const [error, setError] = useState("");

  // =========================
  // FORMAT TIME
  // =========================

  const formatTimeTo24Hour = (time) => {
    if (!time) return "";

    const value = String(time)
      .trim()
      .toUpperCase();

    const match = value.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/
    );

    if (!match) {
      return value;
    }

    let hours = Number(match[1]);
    const minutes = match[2];
    const period = match[3];

    if (period === "AM") {
      if (hours === 12) {
        hours = 0;
      }
    }

    if (period === "PM") {
      if (hours !== 12) {
        hours += 12;
      }
    }

    return `${String(hours).padStart(
      2,
      "0"
    )}:${minutes}`;
  };

  // =========================
  // PARSE SLOT
  // =========================

  const parseSlot = (slotValue) => {
    if (!slotValue) {
      return {
        startTime: "",
        endTime: "",
      };
    }

    const parts = String(slotValue)
      .split(/\s*(?:-|–|—|to)\s*/i)
      .map((item) => item.trim())
      .filter(Boolean);

    if (parts.length < 2) {
      return {
        startTime: "",
        endTime: "",
      };
    }

    return {
      startTime: formatTimeTo24Hour(parts[0]),
      endTime: formatTimeTo24Hour(parts[1]),
    };
  };

  // =========================
  // FETCH TURF + CREATE BOOKING
  // =========================

  useEffect(() => {
    let cancelled = false;

    const createBooking = async () => {
      const turfId = decodeURIComponent(
        String(id || "")
      ).trim();

      if (!turfId) {
        setError("Invalid turf ID.");
        setLoading(false);
        return;
      }

      if (!currentUser?.email) {
        setError(
          "You must be logged in to create a booking."
        );
        setLoading(false);
        return;
      }

      if (!date) {
        setError(
          "Booking date is missing."
        );
        setLoading(false);
        return;
      }

      const { startTime, endTime } =
        parseSlot(slot);

      if (!startTime || !endTime) {
        setError(
          "Booking time slot is missing or invalid."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // =========================
        // 1. GET TURF
        // =========================

        const turfResponse = await fetch(
          `${API_URL}/turfs/${encodeURIComponent(
            turfId
          )}`
        );

        const turfData =
          await turfResponse
            .json()
            .catch(() => ({}));

        if (!turfResponse.ok) {
          throw new Error(
            turfData?.message ||
              "Failed to load turf information."
          );
        }

        const turfInfo =
          turfData?.turf ||
          turfData?.data ||
          turfData;

        if (
          !turfInfo ||
          typeof turfInfo !== "object"
        ) {
          throw new Error(
            "Invalid turf data received from server."
          );
        }

        if (cancelled) return;

        setTurf(turfInfo);

        // =========================
        // 2. CREATE BOOKING
        // =========================

        setBookingCreating(true);

        const userEmail = currentUser.email
          .trim()
          .toLowerCase();

        const bookingPayload = {
          turfId:
            turfInfo._id ||
            turfInfo.id ||
            turfId,

          userEmail,

          userName:
            currentUser.displayName ||
            currentUser.name ||
            "",

          userPhone:
            currentUser.phone ||
            "",

          date,

          startTime,

          endTime,

          paymentMethod:
            method || "online",

          paymentStatus: "paid",

          status: "confirmed",
        };

        console.log(
          "Creating booking:",
          bookingPayload
        );

        const bookingResponse =
          await fetch(
            `${API_URL}/bookings`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                bookingPayload
              ),
            }
          );

        const bookingData =
          await bookingResponse
            .json()
            .catch(() => ({}));

        if (!bookingResponse.ok) {
          throw new Error(
            bookingData?.message ||
              "Failed to create booking."
          );
        }

        if (
          !bookingData?.booking
        ) {
          throw new Error(
            "Booking was created but no booking data was returned."
          );
        }

        if (cancelled) return;

        setBooking(
          bookingData.booking
        );
      } catch (error) {
        console.error(
          "Booking creation error:",
          error
        );

        if (!cancelled) {
          setError(
            error?.message ||
              "Failed to create booking."
          );
        }
      } finally {
        if (!cancelled) {
          setBookingCreating(false);
          setLoading(false);
        }
      }
    };

    createBooking();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    date,
    slot,
    method,
    currentUser?.email,
  ]);

  // =========================
  // LOADING
  // =========================

  if (loading || bookingCreating) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-green-600"
          />

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            {bookingCreating
              ? "Confirming your booking..."
              : "Loading booking..."}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we save your booking.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !turf || !booking) {
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
            Booking could not be completed
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "We could not create your booking."}
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

  const turfSport = String(
    turf.sport || "Sports Turf"
  ).trim();

  const turfLocation = String(
    turf.location ||
      turf.area ||
      "Dhaka, Bangladesh"
  ).trim();

  const turfPrice = Number(
    booking.price ?? turf.price
  );

  const safePrice =
    Number.isFinite(turfPrice) &&
    turfPrice >= 0
      ? turfPrice
      : 0;

  const formattedDate = date
    ? new Date(
        `${date}T00:00:00`
      ).toLocaleDateString(
        "en-BD",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Not selected";

  const paymentMethod =
    method === "bkash"
      ? "bKash"
      : method === "nagad"
        ? "Nagad"
        : method === "card"
          ? "Card Payment"
          : "Online Payment";

  // =========================
  // BOOKING REFERENCE
  // =========================

  const bookingId =
    booking._id ||
    booking.id ||
    booking.bookingId ||
    "";

  const bookingReference = bookingId
    ? `KHL-${String(bookingId)
        .slice(-8)
        .toUpperCase()}`
    : "KHL-BOOKING";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* SUCCESS */}
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
            Your booking has been successfully
            saved. Get ready for your game!
          </p>
        </div>

        {/* TURF + BOOKING */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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

                {turfLocation}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

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

              {/* TIME */}
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
                      {slot ||
                        `${booking.startTime} - ${booking.endTime}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* PAYMENT */}
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

              {/* PRICE */}
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs text-green-700">
                  Total Paid
                </p>

                <p className="mt-2 text-2xl font-bold text-green-700">
                  ৳
                  {safePrice.toLocaleString(
                    "en-BD"
                  )}
                </p>

                <p className="mt-1 text-xs text-green-600">
                  Booking payment successful
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
          Your booking has been saved successfully
          to your Khelaro account.
        </p>
      </div>
    </main>
  );
};

export default BookingSuccess;