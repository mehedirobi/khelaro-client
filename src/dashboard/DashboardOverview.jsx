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
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const STATUS_STYLES = {
  confirmed: "bg-green-50 text-green-600",
  pending: "bg-yellow-50 text-yellow-600",
  cancelled: "bg-red-50 text-red-600",
  completed: "bg-blue-50 text-blue-600",
};

const DashboardOverview = () => {
  const { currentUser } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchUserBookings = async () => {
      const email = currentUser?.email?.trim().toLowerCase();

      if (!email) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/bookings/user/${encodeURIComponent(email)}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch bookings."
          );
        }

        const userBookings = Array.isArray(data?.bookings)
          ? data.bookings
          : Array.isArray(data)
          ? data
          : [];

        setBookings(userBookings);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Dashboard booking fetch error:", error);

        setError(
          error?.message || "Failed to load your bookings."
        );

        setBookings([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUserBookings();

    return () => controller.abort();
  }, [currentUser?.email]);

  const stats = useMemo(() => {
    const upcomingBookings = bookings.filter((booking) =>
      ["pending", "confirmed"].includes(
        String(booking.status).toLowerCase()
      )
    );

    const completedBookings = bookings.filter(
      (booking) =>
        String(booking.status).toLowerCase() === "completed"
    );

    const totalSpent = bookings.reduce((total, booking) => {
      if (
        String(booking.paymentStatus).toLowerCase() !== "paid"
      ) {
        return total;
      }

      const price = Number(booking.price);

      return total + (Number.isFinite(price) ? price : 0);
    }, 0);

    return [
      {
        title: "Total Bookings",
        value: bookings.length,
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
        value: `৳${totalSpent.toLocaleString("en-BD")}`,
        description: "On turf bookings",
        icon: Wallet,
      },
    ];
  }, [bookings]);

  const recentBookings = useMemo(
    () => bookings.slice(0, 3),
    [bookings]
  );

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return String(status)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusStyle = (status) =>
    STATUS_STYLES[String(status).toLowerCase()] ||
    "bg-gray-50 text-gray-600";

  const userName =
    currentUser?.displayName ||
    currentUser?.name ||
    currentUser?.email?.split("@")[0] ||
    "User";

  return (
    <main>
      {/* Header */}
      <header>
        <Link
          to="/turfs"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Home
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-green-600">
            Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome back, {userName}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Here is an overview of your turf bookings and
            activities.
          </p>
        </div>
      </header>

      {/* Stats */}
      <section
        aria-label="Booking statistics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 truncate text-2xl font-bold text-gray-900">
                    {loading ? "—" : stat.value}
                  </h2>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Icon size={21} aria-hidden="true" />
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                {stat.description}
              </p>
            </article>
          );
        })}
      </section>

      {/* Main Content */}
      <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent Bookings */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
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
              className="text-sm font-medium text-green-600 transition-colors hover:text-green-700"
            >
              View all
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-8 text-center">
              <div
                className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-green-600"
                aria-label="Loading"
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

              <p className="mt-2 text-xs text-gray-400">
                Please refresh the page and try again.
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            recentBookings.length === 0 && (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CalendarDays
                    size={22}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  No bookings yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  You have not booked any turf yet.
                </p>

                <Link
                  to="/turfs"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Find a Turf
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            )}

          {/* Bookings */}
          {!loading &&
            !error &&
            recentBookings.length > 0 && (
              <div className="divide-y divide-gray-100">
                {recentBookings.map((booking) => {
                  const bookingId =
                    booking._id || booking.id || "";

                  const status = String(
                    booking.status || ""
                  ).toLowerCase();

                  const paymentStatus = String(
                    booking.paymentStatus || ""
                  ).toLowerCase();

                  const price = Number(booking.price);

                  return (
                    <article
                      key={bookingId}
                      className="p-5 transition-colors hover:bg-gray-50/60"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Booking Information */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="max-w-full truncate font-semibold text-gray-900">
                              {booking.turfName ||
                                booking.name ||
                                "Turf Booking"}
                            </h3>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                                status
                              )}`}
                            >
                              {formatStatus(status)}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin
                                size={14}
                                aria-hidden="true"
                              />
                              {booking.turfLocation ||
                                booking.location ||
                                "Dhaka"}
                            </span>

                            <span className="flex items-center gap-1">
                              <CalendarDays
                                size={14}
                                aria-hidden="true"
                              />
                              {formatDate(booking.date)}
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock3
                                size={14}
                                aria-hidden="true"
                              />
                              {booking.startTime || "--:--"}{" "}
                              - {booking.endTime || "--:--"}
                            </span>
                          </div>

                          <div className="mt-2">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                paymentStatus === "paid"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-gray-50 text-gray-500"
                              }`}
                            >
                              {paymentStatus === "paid"
                                ? "Payment Paid"
                                : "Payment Unpaid"}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between gap-4 sm:block sm:shrink-0 sm:text-right">
                          <p className="font-bold text-gray-900">
                            ৳
                            {(Number.isFinite(price)
                              ? price
                              : 0
                            ).toLocaleString("en-BD")}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {bookingId
                              ? `KHL-${String(bookingId)
                                  .slice(-6)
                                  .toUpperCase()}`
                              : "Booking"}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </section>

        {/* Quick Actions */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-gray-900 p-6 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <CalendarDays
                size={22}
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Ready to play?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-300">
              Find and book the perfect turf for your next
              game.
            </p>

            <Link
              to="/turfs"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-400 transition-colors hover:text-green-300"
            >
              Explore Turfs
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2
                  size={21}
                  aria-hidden="true"
                />
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
              Weekend and evening slots are usually booked
              faster. Reserve your preferred time early.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default DashboardOverview;