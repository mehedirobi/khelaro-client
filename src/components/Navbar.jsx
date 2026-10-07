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
  Search,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

      localStorage.setItem(
        "khelaro-user",
        JSON.stringify(finalUser)
      );

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    {
      name: "Home",
      path: "/",
      end: true,
    },
    {
      name: "Find Turf",
      path: "/turfs",
      icon: Search,
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

  const getRoleColor = () => {
    if (isAdmin) return "text-red-600 bg-red-50";
    if (isOwner) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-xl"
          : "border-gray-100 bg-white"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-lg font-extrabold text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
            <span className="relative z-10">K</span>

            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
          </div>

          <div className="leading-none">
            <span className="block text-[20px] font-extrabold tracking-tight text-gray-950">
              Khelaro
            </span>

            <span className="mt-0.5 hidden text-[9px] font-medium uppercase tracking-[0.18em] text-gray-400 sm:block">
              Play. Book. Enjoy.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {Icon && (
                      <Icon
                        size={15}
                        strokeWidth={2}
                        className={`transition-transform duration-300 ${
                          isActive
                            ? "scale-105"
                            : "group-hover:scale-105"
                        }`}
                      />
                    )}

                    <span>{link.name}</span>

                    <span
                      className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-green-600 transition-all duration-300 ${
                        isActive
                          ? "w-5 opacity-100"
                          : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-60"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-2 lg:flex">
          {isUserLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-100" />
            </div>
          ) : currentUser ? (
            <>
              {/* Wishlist */}
              {isCustomer && (
                <NavLink
                  to={wishlistPath}
                  aria-label="Wishlist"
                  className={({ isActive }) =>
                    `group relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isActive
                        ? "border-red-100 bg-red-50 text-red-500"
                        : "border-transparent text-gray-500 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Heart
                        size={18}
                        strokeWidth={isActive ? 2.2 : 1.9}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />

                      {isActive && (
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                      )}
                    </>
                  )}
                </NavLink>
              )}

              {/* Dashboard */}
              <NavLink
                to={dashboardPath}
                className={({ isActive }) =>
                  `group flex h-10 items-center gap-2 rounded-xl border px-3.5 text-[13px] font-semibold transition-all duration-300 ${
                    isActive
                      ? "border-green-200 bg-green-50 text-green-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  }`
                }
              >
                <LayoutDashboard
                  size={17}
                  strokeWidth={1.9}
                  className="transition-transform duration-300 group-hover:scale-105"
                />

                <span>Dashboard</span>
              </NavLink>

              {/* Profile */}
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen((prev) => !prev)
                  }
                  className={`group flex h-11 items-center gap-2 rounded-xl border bg-white px-2 py-1.5 transition-all duration-300 ${
                    isProfileOpen
                      ? "border-green-200 bg-green-50/50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  aria-expanded={isProfileOpen}
                  aria-label="Open profile menu"
                >
                  {/* Avatar */}
                  <div className="relative">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={userName}
                        className="h-8 w-8 rounded-lg object-cover ring-2 ring-white"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-green-200 text-sm font-bold text-green-700">
                        {userInitial}
                      </div>
                    )}

                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                  </div>

                  <div className="hidden max-w-[110px] text-left xl:block">
                    <p className="truncate text-xs font-bold text-gray-900">
                      {userName}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                      {roleLabel}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={`text-gray-400 transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 origin-top-right animate-[navbarDrop_180ms_ease-out] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50">
                    {/* User Info */}
                    <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4">
                      <div className="flex items-center gap-3">
                        {userPhoto ? (
                          <img
                            src={userPhoto}
                            alt={userName}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 text-base font-bold text-green-700">
                            {userInitial}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {userName}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {userEmail}
                          </p>

                          <span
                            className={`mt-1.5 inline-flex rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getRoleColor()}`}
                          >
                            {roleLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu */}
                    <div className="p-2">
                      <Link
                        to={dashboardPath}
                        onClick={closeProfile}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-700"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition group-hover:bg-white group-hover:text-green-600">
                          <LayoutDashboard size={16} />
                        </span>

                        <span>Dashboard</span>
                      </Link>

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/users"
                            onClick={closeProfile}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-950"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                              <UserRound size={16} />
                            </span>
                            Manage Users
                          </Link>

                          <Link
                            to="/admin/turfs"
                            onClick={closeProfile}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-950"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                              <Search size={16} />
                            </span>
                            Manage Turfs
                          </Link>

                          <Link
                            to="/admin/bookings"
                            onClick={closeProfile}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-950"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                              <LayoutDashboard size={16} />
                            </span>
                            Manage Bookings
                          </Link>

                          <Link
                            to="/admin/revenue"
                            onClick={closeProfile}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-950"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                              <span className="text-xs font-bold">
                                ৳
                              </span>
                            </span>
                            Revenue
                          </Link>
                        </>
                      )}

                      <Link
                        to={profilePath}
                        onClick={closeProfile}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-950"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition group-hover:bg-white group-hover:text-gray-700">
                          <CircleUserRound size={16} />
                        </span>

                        My Profile
                      </Link>

                      {isCustomer && (
                        <Link
                          to={wishlistPath}
                          onClick={closeProfile}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition group-hover:bg-white group-hover:text-red-500">
                            <Heart size={16} />
                          </span>

                          Wishlist
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 transition group-hover:bg-white">
                          <LogOut size={16} />
                        </span>

                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="group flex h-10 items-center gap-2 rounded-xl px-4 text-[13px] font-semibold text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-gray-950"
              >
                <UserRound
                  size={16}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="group relative flex h-10 items-center overflow-hidden rounded-xl bg-green-600 px-5 text-[13px] font-bold text-white shadow-sm shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md hover:shadow-green-600/20"
              >
                <span className="relative z-10">
                  Get Started
                </span>

                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 lg:hidden ${
            isMenuOpen
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
          aria-label={
            isMenuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl animate-[navbarMobile_220ms_ease-out] px-4 py-5 sm:px-6">
            {/* Mobile User Card */}
            {!isUserLoading && currentUser && (
              <div className="mb-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-base font-bold text-green-700">
                      {userInitial}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {userName}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {userEmail}
                    </p>

                    <span
                      className={`mt-1.5 inline-flex rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getRoleColor()}`}
                    >
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.end}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-green-50 text-green-700 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {Icon && (
                          <Icon
                            size={17}
                            className={`transition-transform duration-300 ${
                              isActive
                                ? "scale-105"
                                : "group-hover:translate-x-0.5"
                            }`}
                          />
                        )}

                        <span>{link.name}</span>

                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green-600" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              {!isUserLoading && currentUser && (
                <>
                  <div className="my-2 border-t border-gray-100" />

                  <NavLink
                    to={dashboardPath}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <LayoutDashboard
                      size={18}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />

                    Dashboard
                  </NavLink>

                  {isAdmin && (
                    <>
                      <NavLink
                        to="/admin/users"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <UserRound size={18} />
                        Manage Users
                      </NavLink>

                      <NavLink
                        to="/admin/turfs"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <Search size={18} />
                        Manage Turfs
                      </NavLink>

                      <NavLink
                        to="/admin/bookings"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <LayoutDashboard size={18} />
                        Manage Bookings
                      </NavLink>

                      <NavLink
                        to="/admin/revenue"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <span className="text-sm font-bold">
                          ৳
                        </span>
                        Revenue
                      </NavLink>
                    </>
                  )}

                  {isCustomer && (
                    <NavLink
                      to={wishlistPath}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-red-50 text-red-600"
                            : "text-gray-700 hover:bg-red-50 hover:text-red-600"
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
                      `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-gray-100 text-gray-900"
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

            {/* Mobile Bottom Actions */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              {isUserLoading ? (
                <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
              ) : currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-100"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50"
                  >
                    <UserRound size={17} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-green-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navbar Animations */}
      <style>{`
        @keyframes navbarDrop {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes navbarMobile {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;