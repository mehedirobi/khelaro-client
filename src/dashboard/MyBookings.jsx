import { useContext, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Wallet,
  Trophy,
  ArrowRight,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Loader2,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const DashboardOverview = () => {
  const { currentUser } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH USER BOOKINGS
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchUserBookings = async () => {
      const userEmail = currentUser?.email?.trim().toLowerCase();

      if (!userEmail) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const endpoint = `${API_URL}/bookings/user/${encodeURIComponent(
          userEmail
        )}`;

        console.log("Loading user bookings:", endpoint);

        const response = await fetch(endpoint, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json().catch(() => ({}));

        console.log("User bookings response:", data);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Failed to fetch your bookings."
          );
        }

        // Supports:
        // []
        // { bookings: [] }
        // { data: [] }
        // { data: { bookings: [] } }

        let bookingList = [];

        if (Array.isArray(data)) {
          bookingList = data;
        } else if (Array.isArray(data?.bookings)) {
          bookingList = data.bookings;
        } else if (Array.isArray(data?.data)) {
          bookingList = data.data;
        } else if (Array.isArray(data?.data?.bookings)) {
          bookingList = data.data.bookings;
        }

        // Normalize booking data
        const normalizedBookings = bookingList
          .filter(
            (booking) =>
              booking &&
              typeof booking === "object"
          )
          .map((booking) => ({
            ...booking,
            _id:
              booking._id ||
              booking.id ||
              booking.bookingId ||
              null,

            userEmail:
              booking.userEmail ||
              booking.email ||
              "",

            turfName:
              booking.turfName ||
              booking.turf?.name ||
              booking.name ||
              "Turf Booking",

            location:
              booking.location ||
              booking.turfLocation ||
              booking.turf?.location ||
              booking.area ||
              "Dhaka",

            date: booking.date || "",

            startTime:
              booking.startTime ||
              booking.start ||
              "",

            endTime:
              booking.endTime ||
              booking.end ||
              "",

            price:
              Number(
                booking.price ??
                  booking.totalPrice ??
                  booking.amount ??
                  0
              ) || 0,

            status: String(
              booking.status || "pending"
            ).toLowerCase(),

            paymentStatus: String(
              booking.paymentStatus ||
                "unpaid"
            ).toLowerCase(),
          }))
          .sort((a, b) => {
            const dateA = new Date(
              `${a.date || ""}T${a.startTime || "00:00"}`
            ).getTime();

            const dateB = new Date(
              `${b.date || ""}T${b.startTime || "00:00"}`
            ).getTime();

            return dateB - dateA;
          });

        setBookings(normalizedBookings);
      } catch (err) {
        if (err?.name === "AbortError") {
          return;
        }

        console.error(
          "Dashboard booking fetch error:",
          err
        );

        setBookings([]);

        setError(
          err?.message ||
            "Failed to load your bookings."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUserBookings();

    return () => {
      controller.abort();
    };
  }, [currentUser?.email]);

  // ==========================================
  // BOOKING STATISTICS
  // ==========================================

  const stats = useMemo(() => {
    const totalBookings = bookings.length;

    const upcomingBookings = bookings.filter(
      (booking) =>
        booking.status === "pending" ||
        booking.status === "confirmed"
    );

    const completedBookings = bookings.filter(
      (booking) =>
        booking.status === "completed"
    );

    const totalSpent = bookings.reduce(
      (total, booking) => {
        const isPaid =
          booking.paymentStatus === "paid";

        if (!isPaid) {
          return total;
        }

        return total + (Number(booking.price) || 0);
      },
      0
    );

    return [
      {
        title: "Total Bookings",
        value: totalBookings,
        description: "All time bookings",
        icon: CalendarDays,
      },
      {
        title: "Upcoming Games",
        value: upcomingBookings.length,
        description: "Games scheduled",
        icon: Clock3,
      },
      {
        title: "Completed",
        value: completedBookings.length,
        description: "Games played",
        icon: Trophy,
      },
      {
        title: "Total Spent",
        value: `৳${totalSpent.toLocaleString(
          "en-BD"
        )}`,
        description: "Paid turf bookings",
        icon: Wallet,
      },
    ];
  }, [bookings]);

  // ==========================================
  // RECENT BOOKINGS
  // ==========================================

  const recentBookings = useMemo(() => {
    return bookings.slice(0, 3);
  }, [bookings]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS LABEL
  // ==========================================

  const getStatusLabel = (status) => {
    if (!status) {
      return "Unknown";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-600";

      case "pending":
        return "bg-yellow-50 text-yellow-600";

      case "cancelled":
        return "bg-red-50 text-red-600";

      case "completed":
        return "bg-blue-50 text-blue-600";

      case "rejected":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  // ==========================================
  // PAYMENT STYLE
  // ==========================================

  const getPaymentStyle = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-50 text-green-600";

      case "unpaid":
        return "bg-yellow-50 text-yellow-600";

      case "failed":
        return "bg-red-50 text-red-600";

      case "refunded":
        return "bg-purple-50 text-purple-600";

      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  // ==========================================
  // USER NAME
  // ==========================================

  const userName =
    currentUser?.displayName ||
    currentUser?.name ||
    currentUser?.email?.split("@")[0] ||
    "User";

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main>
      {/* ==========================================
          HEADER
      ========================================== */}

      <div>
        <Link
          to="/turfs"
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-600
            px-5
            text-sm
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-green-700
            hover:shadow-lg
            hover:shadow-green-600/20
          "
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-green-600">
            Dashboard
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Welcome back, {userName}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Here is an overview of your turf
                bookings and activities.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="
                inline-flex
                h-10
                w-fit
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                text-sm
                font-medium
                text-gray-600
                transition
                hover:border-green-300
                hover:text-green-600
              "
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          STATS
      ========================================== */}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                transition-all
                duration-200
                hover:border-gray-300
                hover:shadow-sm
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {loading ? "—" : stat.value}
                  </h2>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-50
                    text-green-600
                  "
                >
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* ==========================================
            RECENT BOOKINGS
        ========================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white">
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-100
              p-5
            "
          >
            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Bookings
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your latest turf reservations
              </p>
            </div>

            <Link
              to="/dashboard/bookings"
              className="
                text-sm
                font-medium
                text-green-600
                transition-colors
                hover:text-green-700
              "
            >
              View all
            </Link>
          </div>

          {/* Loading */}

          {loading && (
            <div className="p-8 text-center">
              <Loader2
                size={28}
                className="mx-auto animate-spin text-green-600"
              />

              <p className="mt-3 text-sm text-gray-500">
                Loading your bookings...
              </p>
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-gray-900
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-gray-800
                "
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            recentBookings.length === 0 && (
              <div className="p-8 text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-50
                    text-green-600
                  "
                >
                  <CalendarDays size={22} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  No bookings yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  You have not booked any turf yet.
                </p>

                <Link
                  to="/turfs"
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-green-600
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-green-700
                  "
                >
                  Find a Turf
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

          {/* Bookings */}

          {!loading &&
            !error &&
            recentBookings.length > 0 && (
              <div className="divide-y divide-gray-100">
                {recentBookings.map(
                  (booking, index) => {
                    const bookingKey =
                      booking._id ||
                      booking.id ||
                      booking.bookingId ||
                      `booking-${index}`;

                    const bookingPrice =
                      Number(
                        booking.price
                      ) || 0;

                    return (
                      <div
                        key={bookingKey}
                        className="p-5"
                      >
                        <div
                          className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                        >
                          {/* Booking Information */}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {booking.turfName}
                              </h3>

                              <span
                                className={`
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[11px]
                                  font-semibold
                                  ${getStatusStyle(
                                    booking.status
                                  )}
                                `}
                              >
                                {getStatusLabel(
                                  booking.status
                                )}
                              </span>
                            </div>

                            <div
                              className="
                                mt-2
                                flex
                                flex-wrap
                                gap-x-4
                                gap-y-2
                                text-xs
                                text-gray-500
                              "
                            >
                              <span className="flex items-center gap-1">
                                <MapPin
                                  size={14}
                                />

                                {booking.location}
                              </span>

                              <span className="flex items-center gap-1">
                                <CalendarDays
                                  size={14}
                                />

                                {formatDate(
                                  booking.date
                                )}
                              </span>

                              <span className="flex items-center gap-1">
                                <Clock3
                                  size={14}
                                />

                                {booking.startTime ||
                                  "--:--"}{" "}
                                -{" "}
                                {booking.endTime ||
                                  "--:--"}
                              </span>
                            </div>

                            {/* Payment */}

                            <div className="mt-3">
                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[11px]
                                  font-semibold
                                  ${getPaymentStyle(
                                    booking.paymentStatus
                                  )}
                                `}
                              >
                                <CreditCard
                                  size={12}
                                />

                                {booking.paymentStatus ===
                                "paid"
                                  ? "Payment Paid"
                                  : booking.paymentStatus ===
                                    "failed"
                                  ? "Payment Failed"
                                  : booking.paymentStatus ===
                                    "refunded"
                                  ? "Refunded"
                                  : "Payment Pending"}
                              </span>
                            </div>
                          </div>

                          {/* Price */}

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-4
                              sm:block
                              sm:shrink-0
                              sm:text-right
                            "
                          >
                            <div>
                              <p className="text-xs text-gray-400">
                                Total
                              </p>

                              <p className="mt-1 font-bold text-gray-900">
                                ৳
                                {bookingPrice.toLocaleString(
                                  "en-BD"
                                )}
                              </p>
                            </div>

                            <p className="mt-1 text-xs text-gray-400">
                              {booking._id
                                ? `KHL-${String(
                                    booking._id
                                  )
                                    .slice(-6)
                                    .toUpperCase()}`
                                : "Booking"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
        </div>

        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}

        <div className="space-y-6">
          <div className="rounded-2xl bg-gray-900 p-6 text-white">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-white/10
              "
            >
              <CalendarDays size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Ready to play?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-300">
              Find and book the perfect turf for
              your next game.
            </p>

            <Link
              to="/turfs"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-green-400
                transition-colors
                hover:text-green-300
              "
            >
              Explore Turfs
              <ArrowRight size={17} />
            </Link>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-50
                  text-green-600
                "
              >
                <CheckCircle2 size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Booking Tip
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Plan ahead for better availability.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Weekend and evening slots are usually
              booked faster. Reserve your preferred
              time early.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardOverview;