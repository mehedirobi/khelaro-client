import {
  CircleDollarSign,
  TrendingUp,
  CalendarCheck,
  WalletCards,
  ArrowUpRight,
} from "lucide-react";

const AdminRevenue = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "৳5,84,500",
      change: "+18.4%",
      icon: CircleDollarSign,
    },
    {
      title: "This Month",
      value: "৳1,28,400",
      change: "+12.8%",
      icon: TrendingUp,
    },
    {
      title: "Booking Revenue",
      value: "৳4,92,000",
      change: "+15.6%",
      icon: CalendarCheck,
    },
    {
      title: "Platform Earnings",
      value: "৳92,500",
      change: "+21.3%",
      icon: WalletCards,
    },
  ];

  const monthlyRevenue = [
    { month: "Jan", value: 42 },
    { month: "Feb", value: 55 },
    { month: "Mar", value: 48 },
    { month: "Apr", value: 68 },
    { month: "May", value: 60 },
    { month: "Jun", value: 76 },
    { month: "Jul", value: 72 },
    { month: "Aug", value: 92 },
  ];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Revenue
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track Khelaro's revenue and financial performance.
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

              <div className="flex items-center justify-between">

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

      {/* Revenue Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

          <div>
            <h2 className="font-semibold text-gray-900">
              Monthly Revenue
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Revenue performance over the last 8 months.
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
            2026
          </div>

        </div>

        <div className="mt-8 flex h-64 items-end gap-3">

          {monthlyRevenue.map((item) => (
            <div
              key={item.month}
              className="flex flex-1 flex-col items-center gap-2"
            >

              <div className="flex h-full w-full items-end">

                <div
                  className="w-full rounded-t-lg bg-green-100 transition hover:bg-green-200"
                  style={{
                    height: `${item.value}%`,
                  }}
                />

              </div>

              <span className="text-[11px] text-gray-400">
                {item.month}
              </span>

            </div>
          ))}

        </div>

      </div>

      {/* Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="font-semibold text-gray-900">
            Revenue Breakdown
          </h2>

          <div className="mt-6 space-y-5">

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-500">
                  Turf bookings
                </span>

                <span className="font-semibold text-gray-900">
                  ৳4,92,000
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[84%] rounded-full bg-green-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-500">
                  Platform commission
                </span>

                <span className="font-semibold text-gray-900">
                  ৳92,500
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[55%] rounded-full bg-green-400" />
              </div>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="font-semibold text-gray-900">
            Recent Revenue
          </h2>

          <div className="mt-5 divide-y divide-gray-100">

            {[
              ["Mirpur Football Turf", "৳1,500"],
              ["Uttara Sports Arena", "৳1,800"],
              ["Dhanmondi Turf Zone", "৳1,200"],
              ["Banani Sports Club", "৳2,000"],
            ].map(([name, amount]) => (
              <div
                key={name}
                className="flex items-center justify-between py-3"
              >
                <span className="text-sm text-gray-600">
                  {name}
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {amount}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminRevenue;