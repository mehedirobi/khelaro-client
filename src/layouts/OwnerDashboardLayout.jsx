import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  PlusCircle,
  CalendarDays,
  Wallet,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const OwnerDashboardLayout = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Overview",
      path: "/owner-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Turfs",
      path: "/owner-dashboard/turfs",
      icon: MapPin,
    },
    {
      name: "Add Turf",
      path: "/owner-dashboard/add-turf",
      icon: PlusCircle,
    },
    {
      name: "Bookings",
      path: "/owner-dashboard/bookings",
      icon: CalendarDays,
    },
    {
      name: "Revenue",
      path: "/owner-dashboard/revenue",
      icon: Wallet,
    },
    {
      name: "Profile",
      path: "/owner-dashboard/profile",
      icon: UserRound,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 font-bold text-white">
            K
          </div>

          <span className="font-bold text-gray-900">Khelaro</span>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-100 px-5">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 font-bold text-white">
              K
            </div>

            <span className="text-xl font-bold text-gray-900">
              Khelaro
            </span>
          </Link>
        </div>

        {/* Owner Info */}
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 font-semibold text-green-700">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "Owner"}
                  className="h-full w-full object-cover"
                />
              ) : (
                currentUser?.displayName?.charAt(0)?.toUpperCase() || "O"
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {currentUser?.displayName || "Turf Owner"}
              </p>

              <p className="truncate text-xs text-gray-500">
                Turf Owner
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/owner-dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-green-50 text-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <MapPin size={18} />
            Visit Website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboardLayout;