import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  MapPinned,
  CalendarCheck,
  CircleDollarSign,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Globe,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();

  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems = [
    {
      name: "Overview",
      path: "/admin-dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Users",
      path: "/admin-dashboard/users",
      icon: Users,
    },
    {
      name: "Owners",
      path: "/admin-dashboard/owners",
      icon: UserCheck,
    },
    {
      name: "Turfs",
      path: "/admin-dashboard/turfs",
      icon: MapPinned,
    },
    {
      name: "Bookings",
      path: "/admin-dashboard/bookings",
      icon: CalendarCheck,
    },
    {
      name: "Revenue",
      path: "/admin-dashboard/revenue",
      icon: CircleDollarSign,
    },
    {
      name: "Profile",
      path: "/admin-dashboard/profile",
      icon: UserCircle,
    },
  ];

  // =====================================================
  // CLOSE SIDEBAR
  // =====================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("khelaro-user");
      localStorage.removeItem("khelaro-uid");

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // =====================================================
  // USER INFO
  // =====================================================

  const userName =
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "Admin";

  const userInitial =
    userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64
          flex-col border-r border-gray-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex h-[72px] items-center justify-between border-b border-gray-100 px-5">

          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white">
              K
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-gray-900">
                Khelaro
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
                Admin Panel
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Management
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-green-50 text-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                />

                <span>{item.name}</span>

                <ChevronRight
                  size={15}
                  className="ml-auto opacity-0 transition group-hover:opacity-100"
                />
              </NavLink>
            );
          })}

        </nav>

        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div className="border-t border-gray-100 p-4">

          {/* Visit Website */}

          <Link
            to="/"
            onClick={closeSidebar}
            className="
              mb-2 flex w-full items-center gap-3
              rounded-xl px-3 py-2.5
              text-sm font-medium text-gray-600
              transition
              hover:bg-green-50
              hover:text-green-600
            "
          >
            <Globe size={17} />

            Visit Website
          </Link>

          {/* Admin Card */}

          <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              {userInitial}
            </div>

            <div className="min-w-0">

              <p className="truncate text-xs font-semibold text-gray-900">
                {userName}
              </p>

              <p className="truncate text-[11px] text-gray-500">
                {currentUser?.email}
              </p>

            </div>

          </div>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3
              rounded-xl px-3 py-2.5
              text-sm font-medium text-red-600
              transition hover:bg-red-50
            "
          >
            <LogOut size={17} />

            Logout
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="lg:ml-64">

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            sticky top-0 z-30
            flex h-[72px]
            items-center justify-between
            border-b border-gray-200
            bg-white/95
            px-4 backdrop-blur
            sm:px-6 lg:px-8
          "
        >

          {/* Mobile Menu */}

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              text-gray-700
              hover:bg-gray-100
              lg:hidden
            "
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          {/* Header Text */}

          <div className="hidden lg:block">

            <p className="text-sm font-semibold text-gray-900">
              Admin Dashboard
            </p>

            <p className="text-xs text-gray-500">
              Manage your Khelaro platform
            </p>

          </div>

          {/* Right */}

          <div className="ml-auto flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2 sm:flex">

              <ShieldCheck
                size={16}
                className="text-green-600"
              />

              <span className="text-xs font-semibold text-green-700">
                Administrator
              </span>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              {userInitial}
            </div>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminDashboardLayout;