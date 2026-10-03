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

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const navigate = useNavigate();
  const { currentUser, loading, logout } = useAuth();

  const loadUserData = async () => {
    if (!currentUser?.email) {
      setUserData(null);
      return;
    }

    const email = currentUser.email.trim().toLowerCase();

    const savedUser = localStorage.getItem("khelaro-user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const savedEmail = parsedUser?.email?.trim()?.toLowerCase();

        if (savedEmail === email) {
          setUserData(parsedUser);
        }
      } catch {
        localStorage.removeItem("khelaro-user");
      }
    }

    try {
      setProfileLoading(true);

      const response = await fetch(
        `${API_URL}/users/${encodeURIComponent(email)}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load user:", data);
        return;
      }

      const mongoUser = data?.user || data;

      if (!mongoUser) return;

      const role = String(mongoUser.role || "user")
        .trim()
        .toLowerCase();

      const finalUser = {
        ...mongoUser,
        uid: currentUser.uid || mongoUser.uid || "",
        email,
        role,
      };

      setUserData(finalUser);
      localStorage.setItem("khelaro-user", JSON.stringify(finalUser));
      localStorage.setItem("khelaro-uid", currentUser.uid);
    } catch (error) {
      console.error("MongoDB user fetch error:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const updatedUser = event.detail;

      if (!updatedUser) {
        loadUserData();
        return;
      }

      setUserData((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      localStorage.setItem(
        "khelaro-user",
        JSON.stringify(updatedUser)
      );
    };

    window.addEventListener(
      "khelaro-profile-updated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "khelaro-profile-updated",
        handleProfileUpdate
      );
    };
  }, [currentUser]);

  const userRole = String(userData?.role || "user")
    .trim()
    .toLowerCase();

  const isAdmin = userRole === "admin";
  const isOwner = userRole === "owner";
  const isCustomer = userRole === "user";

  const dashboardPath = isAdmin
    ? "/admin-dashboard"
    : isOwner
    ? "/owner-dashboard"
    : "/dashboard";

  const profilePath = isAdmin
    ? "/admin-dashboard"
    : isOwner
    ? "/owner-dashboard/profile"
    : "/dashboard/profile";

  const wishlistPath = "/dashboard/wishlist";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Turf", path: "/turfs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("khelaro-user");
      localStorage.removeItem("khelaro-uid");

      setUserData(null);
      setIsProfileOpen(false);
      setIsMenuOpen(false);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const userName =
    userData?.name?.trim() ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const userEmail =
    userData?.email ||
    currentUser?.email ||
    "";

  const userPhoto =
    userData?.photoURL ||
    userData?.photo ||
    currentUser?.photoURL ||
    "";

  const userInitial =
    userName.charAt(0).toUpperCase() || "U";

  const roleLabel = isAdmin
    ? "Administrator"
    : isOwner
    ? "Turf Owner"
    : "Customer";

  const isUserLoading = loading || profileLoading;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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

        <div className="hidden items-center gap-2 lg:flex">
          {isUserLoading ? (
            <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-100" />
          ) : currentUser ? (
            <>
              {isCustomer && (
                <Link
                  to={wishlistPath}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-red-50 hover:text-red-500"
                  aria-label="Wishlist"
                >
                  <Heart size={19} strokeWidth={1.8} />
                </Link>
              )}

              <Link
                to={dashboardPath}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-green-50 hover:text-green-600"
                aria-label="Dashboard"
              >
                <LayoutDashboard size={19} strokeWidth={1.8} />
              </Link>

              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen((prev) => !prev)
                  }
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 transition hover:border-gray-300 hover:bg-gray-50"
                  aria-expanded={isProfileOpen}
                  aria-label="Open profile menu"
                >
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
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
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

                    <div className="p-2">
                      <Link
                        to={dashboardPath}
                        onClick={closeProfile}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <LayoutDashboard size={17} />
                        Dashboard
                      </Link>

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

                      <Link
                        to={profilePath}
                        onClick={closeProfile}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <CircleUserRound size={17} />
                        My Profile
                      </Link>

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
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                <UserRound size={17} />
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setIsMenuOpen((prev) => !prev)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 lg:hidden"
          aria-label={
            isMenuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            {!isUserLoading && currentUser && (
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

              {!isUserLoading && currentUser && (
                <>
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
                    <LayoutDashboard size={18} />
                    Dashboard
                  </NavLink>

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
                    <CircleUserRound size={18} />
                    My Profile
                  </NavLink>
                </>
              )}
            </nav>

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