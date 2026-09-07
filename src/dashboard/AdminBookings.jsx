import { useState } from "react";
import {
  Search,
  CalendarCheck,
  Eye,
  MoreHorizontal,
} from "lucide-react";

const AdminBookings = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const bookings = [
    {
      id: "#BK-1001",
      customer: "Mehedi Hasan",
      turf: "Mirpur Football Turf",
      owner: "Arif Hossain",
      date: "27 Aug 2026",
      time: "06:00 PM - 07:00 PM",
      amount: "৳1,500",
      status: "Confirmed",
    },
    {
      id: "#BK-1002",
      customer: "Rakib Ahmed",
      turf: "Uttara Sports Arena",
      owner: "Tanvir Ahmed",
      date: "28 Aug 2026",
      time: "07:00 PM - 08:00 PM",
      amount: "৳1,800",
      status: "Pending",
    },
    {
      id: "#BK-1003",
      customer: "Siam Rahman",
      turf: "Dhanmondi Turf Zone",
      owner: "Fahim Rahman",
      date: "29 Aug 2026",
      time: "08:00 PM - 09:00 PM",
      amount: "৳1,200",
      status: "Completed",
    },
    {
      id: "#BK-1004",
      customer: "Nafis Islam",
      turf: "Banani Sports Club",
      owner: "Sakib Khan",
      date: "30 Aug 2026",
      time: "09:00 PM - 10:00 PM",
      amount: "৳2,000",
      status: "Cancelled",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(search.toLowerCase()) ||
      booking.customer.toLowerCase().includes(search.toLowerCase()) ||
      booking.turf.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || booking.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bookings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor all bookings across the platform.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full lg:max-w-sm">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
          />

        </div>

        <div className="flex flex-wrap gap-2">

          {[
            "All",
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                filter === item
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] text-left">

            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold">Booking</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Turf</th>
                <th className="px-5 py-4 font-semibold">Date & Time</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50"
                >

                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                    {booking.id}
                  </td>

                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-gray-900">
                      {booking.customer}
                    </p>

                    <p className="text-xs text-gray-400">
                      {booking.owner}
                    </p>

                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {booking.turf}
                  </td>

                  <td className="px-5 py-4">

                    <p className="text-sm text-gray-700">
                      {booking.date}
                    </p>

                    <p className="text-xs text-gray-400">
                      {booking.time}
                    </p>

                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                    {booking.amount}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        booking.status === "Confirmed"
                          ? "bg-green-50 text-green-600"
                          : booking.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600"
                          : booking.status === "Completed"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {booking.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-1">

                      <button
                        title="View booking"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Eye size={17} />
                      </button>

                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                        <MoreHorizontal size={17} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {filteredBookings.length === 0 && (
          <div className="py-16 text-center">

            <CalendarCheck
              size={30}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm text-gray-500">
              No bookings found.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default AdminBookings;