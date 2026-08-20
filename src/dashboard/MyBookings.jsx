import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  X,
  Eye,
} from "lucide-react";

const bookingData = [
  {
    id: "KHL-001",
    turf: "Green Field Sports Arena",
    location: "Uttara, Dhaka",
    sport: "Football",
    date: "25 Aug 2026",
    time: "04:00 PM - 05:00 PM",
    price: 1200,
    status: "Upcoming",
  },
  {
    id: "KHL-002",
    turf: "KickOff Football Arena",
    location: "Mirpur, Dhaka",
    sport: "Football",
    date: "28 Aug 2026",
    time: "06:00 PM - 07:00 PM",
    price: 1000,
    status: "Upcoming",
  },
  {
    id: "KHL-003",
    turf: "Urban Sports Zone",
    location: "Mohammadpur, Dhaka",
    sport: "Football",
    date: "15 Aug 2026",
    time: "08:00 PM - 09:00 PM",
    price: 1100,
    status: "Completed",
  },
  {
    id: "KHL-004",
    turf: "PlayGround 360",
    location: "Banani, Dhaka",
    sport: "Football",
    date: "10 Aug 2026",
    time: "07:00 PM - 08:00 PM",
    price: 1500,
    status: "Cancelled",
  },
];

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filteredBookings = bookingData.filter((booking) => {
    const matchesTab =
      activeTab === "All" ||
      booking.status === activeTab;

    const matchesSearch =
      booking.turf
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      booking.location
        .toLowerCase()
        .includes(search.toLowerCase());

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

      {/* Bookings */}
      <div className="mt-6 space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <span className="text-xs text-gray-400">
                      {booking.id}
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-bold text-gray-900">
                    {booking.turf}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {booking.location}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={16} />
                      {booking.date}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={16} />
                      {booking.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5 lg:block lg:text-right">
                  <div>
                    <p className="text-xs text-gray-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      ৳{booking.price.toLocaleString()}
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
          ))
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
              Try changing your filters or search.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBookings;