import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  X,
  Eye,
  Loader2,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
const API_URL = import.meta.env.VITE_API_URL;

const MyBookings = () => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch logged-in user's bookings
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
          currentUser.email.toLowerCase()
        );

        const response = await fetch(
          `${API_URL}/bookings/user/${email}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("My bookings error:", error);
        setError("Failed to load your bookings.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [currentUser?.email]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

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

  // Format time
  const formatTime = (time) => {
    if (!time) return "N/A";

    // If backend already sends something like "18:00"
    const [hours, minutes] = time.split(":");

    if (hours === undefined || minutes === undefined) {
      return time;
    }

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Convert backend status to UI status
  const getDisplayStatus = (booking) => {
    const status = booking.status?.toLowerCase();

    if (status === "cancelled" || status === "canceled") {
      return "Cancelled";
    }

    if (status === "completed") {
      return "Completed";
    }

    // Pending / confirmed bookings
    const bookingDate = new Date(booking.date);
    const today = new Date();

    bookingDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return "Completed";
    }

    return "Upcoming";
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const displayStatus = getDisplayStatus(booking);

    const matchesTab =
      activeTab === "All" ||
      displayStatus === activeTab;

    const searchText = search.toLowerCase();

    const matchesSearch =
      booking.turfName
        ?.toLowerCase()
        .includes(searchText) ||
      booking.ownerEmail
        ?.toLowerCase()
        .includes(searchText) ||
      booking.status
        ?.toLowerCase()
        .includes(searchText);

    return matchesTab && matchesSearch;
  });

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
        <p className="text-sm font-medium text-green-600">
          Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          My Bookings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage and track all your turf reservations.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", "Upcoming", "Completed", "Cancelled"].map(
            (tab) => (
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
            )
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none focus:border-green-500"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-10 flex flex-col items-center justify-center py-16">
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
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Bookings */}
      {!loading && !error && (
        <div className="mt-6 space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const displayStatus = getDisplayStatus(booking);

              return (
                <article
                  key={booking._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Booking Info */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            displayStatus
                          )}`}
                        >
                          {displayStatus}
                        </span>

                        <span className="text-xs text-gray-400">
                          {booking._id
                            ? `KHL-${booking._id.slice(-6).toUpperCase()}`
                            : "Booking"}
                        </span>
                      </div>

                      <h2 className="mt-3 text-lg font-bold text-gray-900">
                        {booking.turfName || "Turf"}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-500">
                        {/* Location */}
                        <span className="flex items-center gap-1.5">
                          <MapPin size={16} />

                          {booking.location ||
                            "Dhaka, Bangladesh"}
                        </span>

                        {/* Date */}
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={16} />

                          {formatDate(booking.date)}
                        </span>

                        {/* Time */}
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={16} />

                          {formatTime(booking.startTime)} -{" "}
                          {formatTime(booking.endTime)}
                        </span>
                      </div>

                      {/* Payment Status */}
                      <div className="mt-4">
                        <span
                          className={`text-xs font-medium ${
                            booking.paymentStatus?.toLowerCase() ===
                            "paid"
                              ? "text-green-600"
                              : "text-orange-500"
                          }`}
                        >
                          Payment:{" "}
                          {booking.paymentStatus || "Unpaid"}
                        </span>
                      </div>
                    </div>

                    {/* Price + Details */}
                    <div className="flex items-center justify-between gap-5 lg:block lg:text-right">
                      <div>
                        <p className="text-xs text-gray-400">
                          Total Amount
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          ৳
                          {Number(
                            booking.price || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600"
                      >
                        <Eye size={16} />
                        Details
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
              <CalendarDays
                size={32}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 font-semibold text-gray-900">
                No bookings found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {bookings.length === 0
                  ? "You haven't booked any turf yet."
                  : "Try changing your filters or search."}
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default MyBookings;