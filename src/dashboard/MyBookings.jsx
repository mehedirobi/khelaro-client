import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Globe,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const TABS = ["All", "Upcoming", "Completed", "Cancelled"];

const STATUS_STYLES = {
  Upcoming: "bg-blue-50 text-blue-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-600",
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "N/A";

  const [hours, minutes] = String(time).split(":");

  if (!hours || !minutes) {
    return String(time);
  }

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDisplayStatus = (booking) => {
  const status = String(booking?.status || "").toLowerCase();

  if (["cancelled", "canceled"].includes(status)) {
    return "Cancelled";
  }

  if (status === "completed") {
    return "Completed";
  }

  if (booking?.date) {
    const bookingDate = new Date(`${booking.date}T00:00:00`);
    const today = new Date();

    if (!Number.isNaN(bookingDate.getTime())) {
      bookingDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (bookingDate < today) {
        return "Completed";
      }
    }
  }

  return "Upcoming";
};

const getBookingReference = (booking) => {
  const id = booking?.bookingId || booking?._id || booking?.id;

  return id
    ? `KHL-${String(id).slice(-6).toUpperCase()}`
    : "Booking";
};

const getStatusStyle = (status) =>
  STATUS_STYLES[status] || "bg-gray-50 text-gray-600";

const MyBookings = () => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchMyBookings = async () => {
      if (!currentUser?.email) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const email = encodeURIComponent(
          currentUser.email.trim().toLowerCase()
        );

        const response = await fetch(
          `${API_URL}/bookings/user/${email}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch bookings."
          );
        }

        const bookingList = Array.isArray(data?.bookings)
          ? data.bookings
          : Array.isArray(data)
            ? data
            : [];

        setBookings(bookingList);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("My bookings error:", error);

        setBookings([]);
        setError(
          error?.message || "Failed to load your bookings."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchMyBookings();

    return () => controller.abort();
  }, [currentUser?.email]);

  const filteredBookings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const displayStatus = getDisplayStatus(booking);

      if (
        activeTab !== "All" &&
        displayStatus !== activeTab
      ) {
        return false;
      }

      if (!searchText) return true;

      const searchableText = [
        booking?.bookingId,
        booking?.turfName,
        booking?.turfLocation,
        booking?.location,
        booking?.ownerEmail,
        booking?.status,
        booking?.paymentStatus,
        booking?.date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchText);
    });
  }, [bookings, activeTab, search]);

  return (
    <main>
      {/* Header */}
      <header>
        <Link
          to="/turfs"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 focus:outline-none focus:ring-4 focus:ring-green-500/20"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-green-600">
            Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            My Bookings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and track all your turf reservations.
          </p>
        </div>
      </header>

      {/* Filters */}
      <section
        aria-label="Booking filters"
        className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-pressed={isActive}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/10 ${
                  isActive
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bookings..."
            aria-label="Search bookings"
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div
          className="mt-10 flex flex-col items-center justify-center py-16"
          role="status"
          aria-live="polite"
        >
          <Loader2
            size={32}
            className="animate-spin text-green-600"
          />

          <p className="mt-4 text-sm text-gray-500">
            Loading your bookings...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-center"
          role="alert"
        >
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>

          <p className="mt-2 text-xs text-red-500">
            Please refresh the page and try again.
          </p>
        </div>
      )}

      {/* Booking List */}
      {!loading && !error && (
        <section className="mt-6 space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const displayStatus =
                getDisplayStatus(booking);

              const location =
                booking?.turfLocation ||
                booking?.location;

              const bookingId =
                booking?._id ||
                booking?.bookingId ||
                booking?.id;

              const paymentStatus = String(
                booking?.paymentStatus || "unpaid"
              ).toLowerCase();

              return (
                <article
                  key={bookingId}
                  className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Booking Info */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            displayStatus
                          )}`}
                        >
                          {displayStatus}
                        </span>

                        <span className="font-mono text-xs text-gray-400">
                          {getBookingReference(booking)}
                        </span>
                      </div>

                      <h2 className="mt-3 truncate text-lg font-bold text-gray-900">
                        {booking?.turfName || "Turf"}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-500">
                        {location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin
                              size={16}
                              aria-hidden="true"
                            />
                            {location}
                          </span>
                        )}

                        <span className="flex items-center gap-1.5">
                          <CalendarDays
                            size={16}
                            aria-hidden="true"
                          />
                          {formatDate(booking?.date)}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock3
                            size={16}
                            aria-hidden="true"
                          />
                          {formatTime(booking?.startTime)}
                          {" - "}
                          {formatTime(booking?.endTime)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <span
                          className={`text-xs font-medium ${
                            paymentStatus === "paid"
                              ? "text-green-600"
                              : "text-orange-500"
                          }`}
                        >
                          Payment:{" "}
                          {booking?.paymentStatus ||
                            "Unpaid"}
                        </span>

                        {booking?.ownerEmail && (
                          <span className="truncate text-xs text-gray-400">
                            Owner: {booking.ownerEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount + Details */}
                    <div className="flex items-center justify-between gap-5 border-t border-gray-100 pt-4 sm:pt-0 lg:block lg:border-0 lg:text-right">
                      <div>
                        <p className="text-xs text-gray-400">
                          Total Amount
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          ৳
                          {Number(
                            booking?.price || 0
                          ).toLocaleString("en-BD")}
                        </p>
                      </div>

                      {bookingId ? (
                        <Link
                          to={`/dashboard/bookings/${encodeURIComponent(
                            String(bookingId)
                          )}`}
                          className="inline-flex items-center rounded-lg text-sm font-semibold text-green-600 transition hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 lg:mt-2"
                        >
                          Details
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Details unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
                <CalendarDays size={28} />
              </div>

              <h2 className="mt-4 font-semibold text-gray-900">
                No bookings found
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {bookings.length === 0
                  ? "You haven't booked any turf yet."
                  : "Try changing your filters or search."}
              </p>

              {bookings.length === 0 && (
                <Link
                  to="/turfs"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/20"
                >
                  <Globe size={16} />
                  Find a Turf
                </Link>
              )}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default MyBookings;