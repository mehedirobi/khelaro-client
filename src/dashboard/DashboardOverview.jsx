import {
  CalendarDays,
  Clock3,
  Wallet,
  Trophy,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const stats = [
    {
      title: "Total Bookings",
      value: "12",
      description: "All time bookings",
      icon: CalendarDays,
    },
    {
      title: "Upcoming Games",
      value: "3",
      description: "Games scheduled",
      icon: Clock3,
    },
    {
      title: "Completed",
      value: "8",
      description: "Games played",
      icon: Trophy,
    },
    {
      title: "Total Spent",
      value: "৳14,500",
      description: "On turf bookings",
      icon: Wallet,
    },
  ];

  const recentBookings = [
    {
      id: "KHL-001",
      turf: "Green Field Sports Arena",
      location: "Uttara, Dhaka",
      date: "25 Aug 2026",
      time: "04:00 PM - 05:00 PM",
      price: 1200,
      status: "Upcoming",
    },
    {
      id: "KHL-002",
      turf: "KickOff Football Arena",
      location: "Mirpur, Dhaka",
      date: "28 Aug 2026",
      time: "06:00 PM - 07:00 PM",
      price: 1000,
      status: "Upcoming",
    },
    {
      id: "KHL-003",
      turf: "Urban Sports Zone",
      location: "Mohammadpur, Dhaka",
      date: "15 Aug 2026",
      time: "08:00 PM - 09:00 PM",
      price: 1100,
      status: "Completed",
    },
  ];

  return (
    <main>
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-green-600">
            Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome back, Mehedi
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Here is an overview of your turf bookings and activities.
          </p>
        </div>

        <Link
          to="/turfs"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Find a Turf
          <ArrowRight size={17} />
        </Link>
      </div>

      {/* Stats */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
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

      {/* Main Content */}
      <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent Bookings */}
        <div className="rounded-2xl border border-gray-200 bg-white">
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
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {booking.turf}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          booking.status === "Upcoming"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {booking.location}
                      </span>

                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {booking.date}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={14} />
                        {booking.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                    <p className="font-bold text-gray-900">
                      ৳{booking.price.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {booking.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-gray-900 p-6 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <CalendarDays size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Ready to play?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-300">
              Find and book the perfect turf for your next game.
            </p>

            <Link
              to="/turfs"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300"
            >
              Explore Turfs
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
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
              Weekend and evening slots are usually booked faster.
              Reserve your preferred time early.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardOverview;