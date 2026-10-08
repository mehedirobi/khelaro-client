import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

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

const DashboardSidebar = () => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser?.email) {
        setUserData(null);
        return;
      }

      const email = currentUser.email.trim().toLowerCase();

      // Show cached user immediately if available.
      const savedUser = localStorage.getItem("khelaro-user");

      if (savedUser) {
        try {
          setUserData(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("khelaro-user");
        }
      }

      try {
        const response = await fetch(
          `${API_URL}/users/${encodeURIComponent(email)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load user (${response.status})`);
        }

        const data = await response.json();
        const mongoUser = data?.user || data;

        setUserData(mongoUser);
        localStorage.setItem(
          "khelaro-user",
          JSON.stringify(mongoUser)
        );
      } catch (error) {
        console.error("Sidebar user fetch error:", error);
      }
    };

    loadUserData();
  }, [currentUser?.email]);

  const userName =
    userData?.name ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const userEmail = userData?.email || currentUser?.email || "";

  const userPhoto = userData?.photoURL || currentUser?.photoURL || "";

  const userInitial = userName.charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("khelaro-user");
      localStorage.removeItem("khelaro-uid");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside
      aria-label="Dashboard navigation"
      className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex"
    >
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center border-b border-gray-100 px-6">
        <Link
          to="/"
          aria-label="Khelaro home"
          className="text-2xl font-bold tracking-tight text-gray-900 transition-opacity hover:opacity-80"
        >
          Khelaro<span className="text-green-600">.</span>
        </Link>
      </div>

      {/* User */}
      <div className="shrink-0 border-b border-gray-100 p-5">
        <div className="flex items-center gap-3">
          {userPhoto ? (
            <img
              src={userPhoto}
              alt={`${userName}'s profile`}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-green-700 ring-2 ring-green-100"
            >
              {userInitial}
            </div>
          )}

          <div className="min-w-0">
            <p
              className="truncate text-sm font-semibold text-gray-900"
              title={userName}
            >
              {userName}
            </p>

            <p
              className="truncate text-xs text-gray-500"
              title={userEmail}
            >
              {userEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Dashboard"
        className="flex-1 space-y-1 overflow-y-auto p-4"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-green-500/30",
                  isActive
                    ? "bg-green-50 text-green-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.2 : 2}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                    aria-hidden="true"
                  />

                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-gray-100 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          <LogOut
            size={19}
            className="shrink-0"
            aria-hidden="true"
          />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;