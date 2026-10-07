import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CreditCard,
  MapPin,
  User,
  Mail,
  ReceiptText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const BookingDetails = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooking = async () => {
      const bookingId = decodeURIComponent(
        String(id || "")
      ).trim();

      if (!bookingId) {
        setError("Invalid booking ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/bookings/${encodeURIComponent(bookingId)}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load booking details."
          );
        }

        const bookingData =
          data?.booking ||
          data?.data ||
          data;

        if (
          !bookingData ||
          typeof bookingData !== "object" ||
          Array.isArray(bookingData)
        ) {
          throw new Error("Invalid booking data received.");
        }

        setBooking(bookingData);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Booking details error:", error);

        setBooking(null);
        setError(
          error?.message || "Failed to load booking details."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBooking();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Loader2
            size={34}
            className="mx-auto animate-spin text-green-600"
          />

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Loading booking details...
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we load your booking.
          </p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle
              size={27}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Booking not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "We could not find the requested booking."}
          </p>

          <Link
            to="/dashboard/bookings"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <ArrowLeft size={17} />
            Back to My Bookings
          </Link>
        </div>
      </main>
    );
  }

  const turfName = String(
    booking.turfName ||
      booking.turf?.name ||
      "Sports Turf"
  ).trim();

  const turfImage =
    typeof booking.turfImage === "string" &&
    booking.turfImage.trim()
      ? booking.turfImage.trim()
      : typeof booking.image === "string" &&
          booking.image.trim()
        ? booking.image.trim()
        : FALLBACK_IMAGE;

  const turfLocation = String(
    booking.location ||
      booking.turfLocation ||
      booking.turf?.location ||
      "Dhaka, Bangladesh"
  ).trim();

  const turfSport = String(
    booking.sport ||
      booking.turf?.sport ||
      "Sports Turf"
  ).trim();

  const userName = String(
    booking.userName || "Customer"
  ).trim();

  const userEmail = String(
    booking.userEmail || "Not available"
  ).trim();

  const bookingDate = booking.date || "";

  const startTime = booking.startTime || "";
  const endTime = booking.endTime || "";

  const timeSlot =
    booking.slot ||
    (startTime && endTime
      ? `${startTime} - ${endTime}`
      : "Not available");

  const bookingPrice = Number(
    booking.price ??
      booking.turfPrice ??
      booking.amount ??
      0
  );

  const serviceFee = Number(
    booking.serviceFee ?? 0
  );

  const totalPrice = Number(
    booking.totalPrice ??
      booking.total ??
      (bookingPrice + serviceFee)
  );

  const safeBookingPrice =
    Number.isFinite(bookingPrice) &&
    bookingPrice >= 0
      ? bookingPrice
      : 0;

  const safeServiceFee =
    Number.isFinite(serviceFee) &&
    serviceFee >= 0
      ? serviceFee
      : 0;

  const safeTotalPrice =
    Number.isFinite(totalPrice) &&
    totalPrice >= 0
      ? totalPrice
      : safeBookingPrice + safeServiceFee;

  const paymentStatus = String(
    booking.paymentStatus || "unpaid"
  ).toLowerCase();

  const bookingStatus = String(
    booking.status || "pending"
  ).toLowerCase();

  const paymentMethod = String(
    booking.paymentMethod ||
      "Not selected"
  );

  const bookingId =
    booking._id ||
    booking.id ||
    booking.bookingId ||
    id;

  const bookingReference = `KHL-${String(
    bookingId
  )
    .slice(-8)
    .toUpperCase()}`;

  const formattedDate = bookingDate
    ? new Date(
        `${bookingDate}T00:00:00`
      ).toLocaleDateString("en-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const createdAt = booking.createdAt
    ? new Date(
        booking.createdAt
      ).toLocaleString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Not available";

  const getStatusClass = (status) => {
    if (
      ["confirmed", "completed", "paid"].includes(
        status
      )
    ) {
      return "bg-green-50 text-green-700";
    }

    if (
      ["cancelled", "failed"].includes(status)
    ) {
      return "bg-red-50 text-red-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  const formatStatus = (status) => {
    return String(status)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-6">
          <Link
            to="/dashboard/bookings"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft size={17} />
            Back to My Bookings
          </Link>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">
                Booking Details
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {turfName}
              </h1>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin
                  size={15}
                  className="text-green-600"
                />
                {turfLocation}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                  bookingStatus
                )}`}
              >
                {formatStatus(bookingStatus)}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                  paymentStatus
                )}`}
              >
                Payment: {formatStatus(paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* TURF CARD */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-[280px_1fr]">
            <div className="h-56 md:h-full">
              <img
                src={turfImage}
                alt={turfName}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src =
                    FALLBACK_IMAGE;
                }}
              />
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {turfSport}
                </span>

                <span className="font-mono text-xs font-semibold text-gray-500">
                  {bookingReference}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {turfName}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin
                  size={16}
                  className="text-green-600"
                />
                {turfLocation}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={19}
                      className="text-green-600"
                    />

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

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <Clock3
                      size={19}
                      className="text-green-600"
                    />

                    <div>
                      <p className="text-xs text-gray-400">
                        Time Slot
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {timeSlot}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* CUSTOMER */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <User
                  size={19}
                  className="text-green-600"
                />
                Customer Information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Name
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {userName}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium text-gray-900">
                    {userEmail}
                  </p>
                </div>
              </div>
            </section>

            {/* BOOKING INFO */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <ReceiptText
                  size={19}
                  className="text-green-600"
                />
                Booking Information
              </h2>

              <div className="mt-5 divide-y divide-gray-100">
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-gray-500">
                    Booking reference
                  </span>

                  <span className="font-mono text-sm font-semibold text-gray-900">
                    {bookingReference}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-gray-500">
                    Booking status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      bookingStatus
                    )}`}
                  >
                    {formatStatus(bookingStatus)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-gray-500">
                    Payment status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      paymentStatus
                    )}`}
                  >
                    {formatStatus(paymentStatus)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-gray-500">
                    Payment method
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-gray-500">
                    Created
                  </span>

                  <span className="text-right text-sm font-medium text-gray-900">
                    {createdAt}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Summary
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Turf booking
                  </span>

                  <span className="font-medium text-gray-900">
                    ৳
                    {safeBookingPrice.toLocaleString(
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
                    {safeServiceFee.toLocaleString(
                      "en-BD"
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-green-600">
                      ৳
                      {safeTotalPrice.toLocaleString(
                        "en-BD"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                    {paymentStatus === "paid" ? (
                      <CheckCircle2 size={19} />
                    ) : (
                      <CircleDollarSign size={19} />
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Payment
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatStatus(paymentStatus)}
                    </p>
                  </div>
                </div>
              </div>

              {paymentStatus !== "paid" && (
                <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <div className="flex gap-3">
                    <CreditCard
                      size={18}
                      className="mt-0.5 shrink-0 text-yellow-600"
                    />

                    <p className="text-xs leading-5 text-yellow-800">
                      Payment gateway is not connected
                      yet. This booking is currently
                      marked as unpaid.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default BookingDetails;