import {
  Users,
  UserCheck,
  MapPinned,
  CalendarCheck,
  CircleDollarSign,
  Clock3,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      change: "+12.5%",
      icon: Users,
    },
    {
      title: "Total Owners",
      value: "86",
      change: "+8.2%",
      icon: UserCheck,
    },
    {
      title: "Total Turfs",
      value: "142",
      change: "+14.4%",
      icon: MapPinned,
    },
    {
      title: "Total Bookings",
      value: "3,684",
      change: "+18.7%",
      icon: CalendarCheck,
    },
  ];

  const recentBookings = [
    {
      id: "#BK-1001",
      customer: "Mehedi Hasan",
      turf: "Mirpur Football Turf",
      date: "27 Aug 2026",
      amount: "৳1,500",
      status: "Confirmed",
    },
    {
      id: "#BK-1002",
      customer: "Rakib Ahmed",
      turf: "Uttara Sports Arena",
      date: "28 Aug 2026",
      amount: "৳1,800",
      status: "Pending",
    },
    {
      id: "#BK-1003",
      customer: "Siam Rahman",
      turf: "Dhanmondi Turf Zone",
      date: "29 Aug 2026",
      amount: "৳1,200",
      status: "Confirmed",
    },
    {
      id: "#BK-1004",
      customer: "Nafis Islam",
      turf: "Banani Sports Club",
      date: "30 Aug 2026",
      amount: "৳2,000",
      status: "Cancelled",
    },
  ];

  const statusStyle = {
    Confirmed: "bg-green-50 text-green-600",
    Pending: "bg-yellow-50 text-yellow-600",
    Cancelled: "bg-red-50 text-red-600",
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Overview
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening across Khelaro.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Icon size={21} />
                </div>

                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  {stat.change}
                  <ArrowUpRight size={13} />
                </span>

              </div>

              <p className="mt-5 text-sm text-gray-500">
                {stat.title}
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>

            </div>
          );
        })}

      </div>

      {/* Revenue + Pending */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Revenue
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                ৳5,84,500
              </p>

              <p className="mt-2 text-xs font-medium text-green-600">
                +18.4% from last month
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CircleDollarSign size={21} />
            </div>

          </div>

          {/* Simple chart */}
          <div className="mt-8 flex h-44 items-end gap-2">

            {[45, 65, 50, 75, 60, 85, 70, 92, 78, 88, 72, 96].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-lg bg-green-100"
                  style={{ height: `${height}%` }}
                />
              )
            )}

          </div>

          <div className="mt-3 flex justify-between text-[10px] text-gray-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
          </div>

        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <Clock3 size={20} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Actions
              </p>

              <p className="text-2xl font-bold text-gray-900">
                18
              </p>
            </div>

          </div>

          <div className="mt-6 space-y-3">

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
              <span className="text-sm text-gray-600">
                Turf approvals
              </span>

              <span className="font-semibold text-gray-900">
                7
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
              <span className="text-sm text-gray-600">
                Owner verification
              </span>

              <span className="font-semibold text-gray-900">
                5
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
              <span className="text-sm text-gray-600">
                Pending bookings
              </span>

              <span className="font-semibold text-gray-900">
                6
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Recent Bookings */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 p-5">

          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Latest activity on the platform
            </p>
          </div>

          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50">
            <MoreHorizontal size={20} />
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left">

            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Booking</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Turf</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="text-sm hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {booking.id}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {booking.customer}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {booking.turf}
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {booking.date}
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {booking.amount}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;