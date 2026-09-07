import { useEffect, useState } from "react";
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

// =====================================================
// API CONFIG
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// =====================================================
// NAVBAR
// =====================================================

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [userData, setUserData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const navigate = useNavigate();

  const { currentUser, loading, logout } = useAuth();

  // =====================================================
  // LOAD MONGODB USER
  // =====================================================

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser?.email) {
        setUserData(null);
        return;
      }

      const firebaseEmail = currentUser.email
        .trim()
        .toLowerCase();

      // -------------------------------------------------
      // First: check localStorage
      // -------------------------------------------------

      const savedUser = localStorage.getItem("khelaro-user");

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);

          const savedEmail = parsedUser?.email
            ?.trim()
            ?.toLowerCase();

          // If localStorage belongs to current Firebase user,
          // use it temporarily.
          if (savedEmail === firebaseEmail) {
            setUserData(parsedUser);
          }
        } catch (error) {
          console.error(
            "Invalid khelaro-user data:",
            error
          );

          localStorage.removeItem("khelaro-user");
        }
      }

      // -------------------------------------------------
      // Always verify latest role from MongoDB
      // -------------------------------------------------

      try {
        setProfileLoading(true);

        const url = `${API_URL}/users/${encodeURIComponent(
          firebaseEmail
        )}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        let data = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          console.error(
            "Failed to load MongoDB user:",
            response.status,
            data
          );

          return;
        }

        const mongoUser = data?.user || data;

        if (!mongoUser) {
          return;
        }

        // -------------------------------------------------
        // Normalize role
        // -------------------------------------------------

        const role = String(
          mongoUser.role || "user"
        )
          .trim()
          .toLowerCase();

        // -------------------------------------------------
        // Final user object
        // -------------------------------------------------

        const finalUser = {
          ...mongoUser,
          uid:
            currentUser.uid ||
            mongoUser.uid ||
            "",
          email: firebaseEmail,
          role,
        };

        // -------------------------------------------------
        // Update React state
        // -------------------------------------------------

        setUserData(finalUser);

        // -------------------------------------------------
        // Update localStorage
        // -------------------------------------------------

        localStorage.setItem(
          "khelaro-user",
          JSON.stringify(finalUser)
        );

        localStorage.setItem(
          "khelaro-uid",
          currentUser.uid
        );

        console.log(
          "Navbar MongoDB user:",
          finalUser
        );

        console.log(
          "Navbar role:",
          role
        );
      } catch (error) {
        console.error(
          "MongoDB user fetch error:",
          error
        );
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  // =====================================================
  // USER ROLE
  // =====================================================

  const userRole = String(
    userData?.role || ""
  )
    .trim()
    .toLowerCase();

  const isAdmin = userRole === "admin";
  const isOwner = userRole === "owner";
  const isCustomer = userRole === "user";

  // =====================================================
  // DASHBOARD PATH
  // =====================================================

  const dashboardPath = isAdmin
    ? "/admin-dashboard"
    : isOwner
    ? "/owner-dashboard"
    : "/dashboard";

  // =====================================================
  // PROFILE PATH
  // =====================================================

  const profilePath = isAdmin
    ? "/admin-dashboard"
    : isOwner
    ? "/owner-dashboard/profile"
    : "/dashboard/profile";

  // =====================================================
  // WISHLIST
  // =====================================================

  const wishlistPath = "/dashboard/wishlist";

  // =====================================================
  // MAIN NAVIGATION
  // =====================================================

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Find Turf",
      path: "/turfs",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  // =====================================================
  // CLOSE MENUS
  // =====================================================

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("khelaro-user");
      localStorage.removeItem("khelaro-uid");

      setUserData(null);

      setIsProfileOpen(false);
      setIsMenuOpen(false);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // =====================================================
  // USER INFORMATION
  // =====================================================

  const userName =
    currentUser?.displayName ||
    userData?.name ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const userEmail =
    currentUser?.email ||
    userData?.email ||
    "";

  const userPhoto =
    currentUser?.photoURL ||
    userData?.photoURL ||
    userData?.photo ||
    "";

  const userInitial =
    userName?.charAt(0)?.toUpperCase() ||
    "U";

  // =====================================================
  // ROLE LABEL
  // =====================================================

  const roleLabel = isAdmin
    ? "Administrator"
    : isOwner
    ? "Turf Owner"
    : "Customer";

  // =====================================================
  // LOADING
  // =====================================================

  const isUserLoading =
    loading || profileLoading;

  // =====================================================
  // UI
  // =====================================================

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =================================================
            LOGO
        ================================================= */}

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

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

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

        {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}

        <div className="hidden items-center gap-2 lg:flex">

          {/* AUTH LOADING */}

          {isUserLoading ? (
            <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-100" />
          ) : currentUser ? (
            <>
              {/* =================================================
                  CUSTOMER WISHLIST
              ================================================= */}

              {isCustomer && (
                <Link
                  to={wishlistPath}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-red-50 hover:text-red-500"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={19}
                    strokeWidth={1.8}
                  />
                </Link>
              )}

              {/* =================================================
                  DASHBOARD
              ================================================= */}

              <Link
                to={dashboardPath}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-green-50 hover:text-green-600"
                aria-label="Dashboard"
              >
                <LayoutDashboard
                  size={19}
                  strokeWidth={1.8}
                />
              </Link>

              {/* =================================================
                  PROFILE
              ================================================= */}

              <div className="relative ml-1">

                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen(
                      (prev) => !prev
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 transition hover:border-gray-300 hover:bg-gray-50"
                  aria-expanded={isProfileOpen}
                  aria-label="Open profile menu"
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

                  {/* User Info */}

                  <div className="hidden text-left xl:block">

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
                      isProfileOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                {isProfileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">

                    {/* USER INFO */}

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

                          <p
                            className={`mt-1 text-[10px] font-semibold uppercase tracking-wide ${
                              isAdmin
                                ? "text-red-600"
                                : isOwner
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          >
                            {roleLabel}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* DROPDOWN LINKS */}

                    <div className="p-2">

                      {/* Dashboard */}

                      <Link
                        to={dashboardPath}
                        onClick={closeProfile}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <LayoutDashboard
                          size={17}
                        />

                        Dashboard
                      </Link>

                      {/* Admin Panel */}

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/users"
                            onClick={closeProfile}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            Manage Users
                          </Link>

                          <Link
                            to="/admin/turfs"
                            onClick={closeProfile}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            Manage Turfs
                          </Link>

                          <Link
                            to="/admin/bookings"
                            onClick={closeProfile}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            Manage Bookings
                          </Link>

                          <Link
                            to="/admin/revenue"
                            onClick={closeProfile}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            Revenue
                          </Link>
                        </>
                      )}

                      {/* Profile */}

                      <Link
                        to={profilePath}
                        onClick={closeProfile}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <CircleUserRound
                          size={17}
                        />

                        My Profile
                      </Link>

                      {/* Wishlist */}

                      {isCustomer && (
                        <Link
                          to={wishlistPath}
                          onClick={closeProfile}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          <Heart size={17} />

                          Wishlist
                        </Link>
                      )}

                    </div>

                    {/* LOGOUT */}

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
            <>
              {/* LOGIN */}

              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                <UserRound size={17} />

                Login
              </Link>

              {/* REGISTER */}

              <Link
                to="/register"
                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setIsMenuOpen(
              (prev) => !prev
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 lg:hidden"
          aria-label={
            isMenuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </div>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">

          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

            {/* USER INFO */}

            {!isUserLoading &&
              currentUser && (
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

                    <p
                      className={`mt-1 text-[11px] font-medium uppercase tracking-wide ${
                        isAdmin
                          ? "text-red-600"
                          : isOwner
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {roleLabel}
                    </p>

                  </div>

                </div>
              )}

            {/* =================================================
                MOBILE NAVIGATION
            ================================================= */}

            <nav className="flex flex-col gap-1">

              {/* MAIN LINKS */}

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

              {/* AUTH LINKS */}

              {!isUserLoading &&
                currentUser && (
                  <>

                    {/* Dashboard */}

                    <NavLink
                      to={dashboardPath}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-green-50 text-green-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      <LayoutDashboard
                        size={18}
                      />

                      Dashboard
                    </NavLink>

                    {/* Admin Links */}

                    {isAdmin && (
                      <>
                        <NavLink
                          to="/admin/users"
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Manage Users
                        </NavLink>

                        <NavLink
                          to="/admin/turfs"
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Manage Turfs
                        </NavLink>

                        <NavLink
                          to="/admin/bookings"
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Manage Bookings
                        </NavLink>

                        <NavLink
                          to="/admin/revenue"
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Revenue
                        </NavLink>
                      </>
                    )}

                    {/* Wishlist */}

                    {isCustomer && (
                      <NavLink
                        to={wishlistPath}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                              ? "bg-red-50 text-red-500"
                              : "text-gray-700 hover:bg-gray-50"
                          }`
                        }
                      >
                        <Heart size={18} />

                        Wishlist
                      </NavLink>
                    )}

                    {/* Profile */}

                    <NavLink
                      to={profilePath}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-green-50 text-green-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      <CircleUserRound
                        size={18}
                      />

                      My Profile
                    </NavLink>

                  </>
                )}

            </nav>

            {/* =================================================
                MOBILE AUTH
            ================================================= */}

            <div className="mt-4 border-t border-gray-100 pt-4">

              {isUserLoading ? (
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