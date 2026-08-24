import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  User,
  LogOut,
  X,
} from "lucide-react";

const DashboardSidebar = () => {
  const menuItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Bookings",
      path: "/dashboard/bookings",
      icon: CalendarDays,
    },
    {
      name: "Wishlist",
      path: "/dashboard/wishlist",
      icon: Heart,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: User,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-gray-100 px-6">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          Khelaro<span className="text-green-600">.</span>
        </Link>
      </div>

      {/* User */}
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
            M
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              Mehedi Hasan
            </p>

            <p className="truncate text-xs text-gray-500">
              mehedi@example.com
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon size={19} />

              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 p-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;