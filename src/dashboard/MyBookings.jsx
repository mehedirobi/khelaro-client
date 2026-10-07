import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  X,
  Eye,
  Loader2,
  ArrowLeft,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const MyBookings = () => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
          currentUser.email.trim().toLowerCase(),
        );

        const response = await fetch(`${API_URL}/bookings/user/${email}`);

        const data = await response.json();

        console.log("My bookings API response:", data);

        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch bookings");
        }

        const bookingList = Array.isArray(data?.bookings) ? data.bookings : [];

        setBookings(bookingList);
      } catch (error) {
        console.error("My bookings error:", error);

        setError(error?.message || "Failed to load your bookings.");

        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [currentUser?.email]);

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

    if (hours === undefined || minutes === undefined) {
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

    if (status === "cancelled" || status === "canceled") {
      return "Cancelled";
    }

    if (status === "completed") {
      return "Completed";
    }

    if (booking?.date) {
      const bookingDate = new Date(`${booking.date}T00:00:00`);

      const today = new Date();

      bookingDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (!Number.isNaN(bookingDate.getTime()) && bookingDate < today) {
        return "Completed";
      }
    }

    return "Upcoming";
  };

  const filteredBookings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const displayStatus = getDisplayStatus(booking);

      const matchesTab = activeTab === "All" || displayStatus === activeTab;

      if (!searchText) {
        return matchesTab;
      }

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

      return matchesTab && searchableText.includes(searchText);
    });
  }, [bookings, activeTab, search]);

  const getStatusStyle = (status) => {
    if (status === "Upcoming") {
      return "bg-blue-50 text-blue-600";
    }

    if (status === "Completed") {
      return "bg-green-50 text-green-600";
    }

    return "bg-red-50 text-red-600";
  };

  return (
    <main>
      {/* Header */}
      <div>
        <Link
          to="/turfs"
          className="
            inline-flex h-11 items-center
            justify-center gap-2 rounded-xl
            bg-green-600 px-5
            text-sm font-semibold text-white
            transition-all duration-200
            hover:bg-green-700
            hover:shadow-lg
            hover:shadow-green-600/20
          "
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-green-600">Dashboard</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            My Bookings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and track all your turf reservations.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", "Upcoming", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={17}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="
              h-11 w-full rounded-xl
              border border-gray-200
              bg-white pl-10 pr-10
              text-sm outline-none
              transition
              focus:border-green-500
              focus:ring-4
              focus:ring-green-500/10
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="
                absolute right-3 top-1/2
                -translate-y-1/2
                text-gray-400
                transition
                hover:text-gray-600
              "
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-10 flex flex-col items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-green-600" />

          <p className="mt-4 text-sm text-gray-500">Loading your bookings...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>

          <p className="mt-2 text-xs text-red-500">
            Check the browser console for the API response.
          </p>
        </div>
      )}

      {/* Bookings */}
      {!loading && !error && (
        <div className="mt-6 space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const displayStatus = getDisplayStatus(booking);

              const location = booking?.turfLocation || booking?.location || "";

              return (
                <article
                  key={booking?._id || booking?.bookingId || booking?.id}
                  className="
                    rounded-2xl
                    border border-gray-200
                    bg-white p-5
                    transition
                    hover:border-gray-300
                    sm:p-6
                  "
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            displayStatus,
                          )}`}
                        >
                          {displayStatus}
                        </span>

                        <span className="text-xs text-gray-400">
                          {booking?.bookingId
                            ? `KHL-${String(booking.bookingId)
                                .slice(-6)
                                .toUpperCase()}`
                            : booking?._id
                              ? `KHL-${String(booking._id)
                                  .slice(-6)
                                  .toUpperCase()}`
                              : "Booking"}
                        </span>
                      </div>

                      <h2 className="mt-3 text-lg font-bold text-gray-900">
                        {booking?.turfName || "Turf"}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-500">
                        {location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin size={16} />
                            {location}
                          </span>
                        )}

                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={16} />

                          {formatDate(booking?.date)}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock3 size={16} />

                          {formatTime(booking?.startTime)}

                          {" - "}

                          {formatTime(booking?.endTime)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4">
                        <span
                          className={`text-xs font-medium ${
                            String(
                              booking?.paymentStatus || "",
                            ).toLowerCase() === "paid"
                              ? "text-green-600"
                              : "text-orange-500"
                          }`}
                        >
                          Payment: {booking?.paymentStatus || "Unpaid"}
                        </span>

                        {booking?.ownerEmail && (
                          <span className="text-xs text-gray-400">
                            Owner: {booking.ownerEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 lg:block lg:text-right">
                      <div>
                        <p className="text-xs text-gray-400">Total Amount</p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          ৳{Number(booking?.price || 0).toLocaleString()}
                        </p>
                      </div>

                      <Link
                        to={`/dashboard/bookings/${booking.id}`}
                        className="text-sm font-semibold text-green-600 hover:text-green-700"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
              <CalendarDays size={32} className="mx-auto text-gray-300" />

              <h2 className="mt-4 font-semibold text-gray-900">
                No bookings found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {bookings.length === 0
                  ? "You haven't booked any turf yet."
                  : "Try changing your filters or search."}
              </p>

              {bookings.length === 0 && (
                <Link
                  to="/turfs"
                  className="
                    mt-5 inline-flex
                    items-center gap-2
                    rounded-xl
                    bg-green-600
                    px-4 py-2.5
                    text-sm font-semibold
                    text-white
                    transition
                    hover:bg-green-700
                  "
                >
                  <Globe size={16} />
                  Find a Turf
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default MyBookings;
