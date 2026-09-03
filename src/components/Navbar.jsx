import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  UserRound,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();

  const { currentUser, loading, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Turf", path: "/turfs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();

      setIsProfileOpen(false);
      closeMenu();

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // User information
  const userName =
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const userEmail = currentUser?.email || "";

  const userPhoto = currentUser?.photoURL;

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white">
            K
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Khelaro
          </span>
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden items-center gap-2 lg:flex">

          {loading ? (
            /* Auth Loading */
            <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-100" />
          ) : currentUser ? (
            /* ================= LOGGED IN ================= */
            <>
              {/* Wishlist */}
              <Link
                to="/dashboard/wishlist"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-red-50 hover:text-red-500"
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.8} />
              </Link>

              {/* Dashboard */}
              <Link
                to={
                  currentUser?.role === "owner"
                    ? "/owner-dashboard"
                    : "/dashboard"
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-green-50 hover:text-green-600"
                aria-label="Dashboard"
              >
                <LayoutDashboard size={19} strokeWidth={1.8} />
              </Link>

              {/* User Profile */}
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen((prev) => !prev)
                  }
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 transition hover:border-gray-300 hover:bg-gray-50"
                  aria-expanded={isProfileOpen}
                >
                  {/* Avatar */}
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                      {userInitial}
                    </div>
                  )}

                  {/* Name */}
                  <div className="hidden xl:block text-left">
                    <p className="max-w-[110px] truncate text-xs font-semibold text-gray-900">
                      {userName}
                    </p>

                    <p className="max-w-[110px] truncate text-[11px] text-gray-500">
                      {userEmail}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={`text-gray-400 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">

                    {/* User Info */}
                    <div className="border-b border-gray-100 p-4">
                      <div className="flex items-center gap-3">

                        {userPhoto ? (
                          <img
                            src={userPhoto}
                            alt={userName}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-base font-bold text-green-700">
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

                    {/* Dropdown Links */}
                    <div className="p-2">

                      <Link
                        to={
                          currentUser?.role === "owner"
                            ? "/owner-dashboard"
                            : "/dashboard"
                        }
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <LayoutDashboard size={17} />
                        Dashboard
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <CircleUserRound size={17} />
                        My Profile
                      </Link>

                      <Link
                        to="/dashboard/wishlist"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <Heart size={17} />
                        Wishlist
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={17} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ================= LOGGED OUT ================= */
            <>
              {/* Login */}
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                <UserRound size={17} />
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

            {/* Mobile User Info */}
            {!loading && currentUser && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">

                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-base font-bold text-green-700">
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

                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-green-600">
                    {currentUser?.role === "owner"
                      ? "Turf Owner"
                      : "Customer"}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-green-50 text-green-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Logged In Links */}
              {!loading && currentUser && (
                <>
                  <NavLink
                    to={
                      currentUser?.role === "owner"
                        ? "/owner-dashboard"
                        : "/dashboard"
                    }
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-green-50 text-green-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/dashboard/wishlist"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Heart size={18} />
                    Wishlist
                  </NavLink>

                  <NavLink
                    to="/dashboard/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <CircleUserRound size={18} />
                    My Profile
                  </NavLink>
                </>
              )}
            </nav>

            {/* ================= MOBILE AUTH ================= */}
            <div className="mt-4 border-t border-gray-100 pt-4">

              {loading ? (
                <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
              ) : currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <UserRound size={17} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Get Started
                  </Link>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;