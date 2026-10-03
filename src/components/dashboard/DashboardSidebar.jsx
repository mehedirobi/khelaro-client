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

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const DashboardSidebar = () => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);

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

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser?.email) {
        setUserData(null);
        return;
      }

      const email = currentUser.email.trim().toLowerCase();

      try {
        const response = await fetch(
          `${API_URL}/users/${encodeURIComponent(email)}`
        );

        if (!response.ok) {
          throw new Error("Failed to load user");
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

        const savedUser = localStorage.getItem("khelaro-user");

        if (savedUser) {
          try {
            setUserData(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem("khelaro-user");
          }
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  const userName =
    userData?.name ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const userEmail =
    userData?.email ||
    currentUser?.email ||
    "";

  const userPhoto =
    userData?.photoURL ||
    currentUser?.photoURL ||
    "";

  const userInitial =
    userName.charAt(0).toUpperCase() || "U";

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
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-gray-100 px-6">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          Khelaro<span className="text-green-600">.</span>
        </Link>
      </div>

      <div className="border-b border-gray-100 p-5">
        <div className="flex items-center gap-3">
          {userPhoto ? (
            <img
              src={userPhoto}
              alt={userName}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              {userInitial}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {userName}
            </p>

            <p className="truncate text-xs text-gray-500">
              {userEmail}
            </p>
          </div>
        </div>
      </div>

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

      <div className="border-t border-gray-100 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;