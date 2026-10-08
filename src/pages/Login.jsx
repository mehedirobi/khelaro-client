import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AuthContext } from "../contexts/AuthProvider.jsx";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const Login = () => {
  const navigate = useNavigate();

  const { login, loading: authLoading } =
    useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoading = loading || authLoading;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const getMongoUser = async (email) => {
    if (!email) {
      throw new Error(
        "Firebase account email was not found."
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const url = `${API_URL}/users/${encodeURIComponent(
      normalizedEmail
    )}`;

    let response;

    try {
      response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
    } catch (fetchError) {
      console.error(
        "MongoDB user fetch error:",
        fetchError
      );

      throw new Error("BACKEND_CONNECTION_ERROR");
    }

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (response.status === 404) {
      throw new Error("USER_PROFILE_NOT_FOUND");
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to load user profile."
      );
    }

    const user = data?.user;

    if (!user || !user.email) {
      throw new Error("USER_PROFILE_NOT_FOUND");
    }

    const databaseEmail = user.email
      .trim()
      .toLowerCase();

    if (databaseEmail !== normalizedEmail) {
      console.error("Email mismatch:", {
        firebaseEmail: normalizedEmail,
        databaseEmail,
      });

      throw new Error("USER_EMAIL_MISMATCH");
    }

    return user;
  };

  const redirectUser = (userData) => {
    const role = String(
      userData?.role || "user"
    )
      .trim()
      .toLowerCase();

    switch (role) {
      case "admin":
        navigate("/admin-dashboard", {
          replace: true,
        });
        break;

      case "owner":
        navigate("/owner-dashboard", {
          replace: true,
        });
        break;

      case "user":
      default:
        navigate("/dashboard", {
          replace: true,
        });
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email
      .trim()
      .toLowerCase();

    const password = formData.password;

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      // Firebase login
      const firebaseUser = await login(
        email,
        password
      );

      if (!firebaseUser) {
        throw new Error(
          "Firebase login failed. Please try again."
        );
      }

      const firebaseEmail =
        firebaseUser.email
          ?.trim()
          .toLowerCase();

      if (!firebaseEmail) {
        throw new Error(
          "Firebase account email was not found."
        );
      }

      // MongoDB profile
      const mongoUser =
        await getMongoUser(firebaseEmail);

      const role = String(
        mongoUser?.role || ""
      )
        .trim()
        .toLowerCase();

      const allowedRoles = [
        "user",
        "owner",
        "admin",
      ];

      if (!allowedRoles.includes(role)) {
        throw new Error("INVALID_ROLE");
      }

      const finalUserData = {
        ...mongoUser,
        uid:
          firebaseUser.uid ||
          mongoUser.uid ||
          "",
        email: firebaseEmail,
        role,
      };

      // Save user locally
      localStorage.setItem(
        "khelaro-user",
        JSON.stringify(finalUserData)
      );

      localStorage.setItem(
        "khelaro-uid",
        firebaseUser.uid
      );

      // Redirect
      redirectUser(finalUserData);
    } catch (error) {
      console.error("Login error:", error);

      if (
        error.message ===
        "USER_PROFILE_NOT_FOUND"
      ) {
        setError(
          "Login successful, but your Khelaro user profile was not found. Please complete registration first."
        );
        return;
      }

      if (
        error.message ===
        "USER_EMAIL_MISMATCH"
      ) {
        setError(
          "Firebase email and Khelaro profile email do not match."
        );
        return;
      }

      if (
        error.message ===
        "BACKEND_CONNECTION_ERROR"
      ) {
        setError(
          "Unable to connect to Khelaro server. Please make sure the backend is running on port 3000."
        );
        return;
      }

      if (
        error.message ===
        "INVALID_ROLE"
      ) {
        setError(
          "Your account has an invalid role. Please contact the administrator."
        );
        return;
      }

      switch (error.code) {
        case "auth/invalid-credential":
          setError(
            "Invalid email or password."
          );
          break;

        case "auth/user-not-found":
          setError(
            "No account found with this email."
          );
          break;

        case "auth/wrong-password":
          setError(
            "Incorrect password."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many failed attempts. Please try again later."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        case "auth/user-disabled":
          setError(
            "This account has been disabled."
          );
          break;

        default:
          setError(
            error.message ||
              "Login failed. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] overflow-hidden bg-gray-50">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="login-card grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_70px_-30px_rgba(0,0,0,0.25)] lg:grid-cols-2">

          {/* LEFT SIDE */}
          <section className="login-panel relative hidden overflow-hidden bg-gray-950 p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="login-glow login-glow-one" />
              <div className="login-glow login-glow-two" />

              <div className="absolute -right-20 bottom-10 h-56 w-56 rounded-full border border-green-500/10" />
              <div className="absolute -right-10 bottom-20 h-36 w-36 rounded-full border border-green-500/10" />
            </div>

            <div className="relative z-10">
              {/* Logo */}
              <Link
                to="/"
                className="group inline-flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white shadow-lg shadow-green-600/20 transition duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
                  K
                </div>

                <span className="text-xl font-bold tracking-tight text-white">
                  Khelaro
                </span>
              </Link>

              {/* Content */}
              <div className="mt-24 max-w-md login-content">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                  <Sparkles size={13} />
                  Play more. Worry less.
                </div>

                <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-white xl:text-5xl">
                  Your next game is
                  <span className="mt-1 block text-green-500">
                    just a booking away.
                  </span>
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400 sm:text-base">
                  Find the best turfs around Dhaka,
                  check availability, and book your
                  preferred playing slot with ease.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="relative z-10 grid grid-cols-2 gap-3 border-t border-gray-800 pt-6">
              <div className="group flex items-center gap-2.5 rounded-xl border border-gray-800 bg-gray-900/50 px-3 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-gray-700 hover:bg-gray-900">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                  <CheckCircle2 size={16} />
                </div>

                <span className="text-xs font-medium text-gray-400">
                  Verified turfs
                </span>
              </div>

              <div className="group flex items-center gap-2.5 rounded-xl border border-gray-800 bg-gray-900/50 px-3 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-gray-700 hover:bg-gray-900">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                  <ShieldCheck size={16} />
                </div>

                <span className="text-xs font-medium text-gray-400">
                  Easy booking
                </span>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="flex items-center p-6 sm:p-10 lg:p-12 xl:p-14">
            <div className="mx-auto w-full max-w-md">

              {/* Mobile logo */}
              <Link
                to="/"
                className="mb-9 inline-flex items-center gap-2.5 lg:hidden"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-base font-bold text-white shadow-md shadow-green-600/20">
                  K
                </div>

                <span className="text-xl font-bold text-gray-900">
                  Khelaro
                </span>
              </Link>

              {/* Heading */}
              <div className="animate-[loginSlideUp_0.5s_ease-out]">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-green-600">
                  Welcome back
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Sign in to Khelaro
                </h2>

                <p className="mt-2.5 text-sm leading-6 text-gray-500">
                  Manage your bookings and find
                  your next game.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 animate-[loginShake_0.35s_ease-in-out]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
                    <AlertCircle size={17} />
                  </div>

                  <p className="pt-1 text-sm leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5 animate-[loginSlideUp_0.65s_ease-out]"
              >
                {/* Email */}
                <div className="login-field">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="group relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-green-600"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="login-field">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-green-600 transition hover:text-green-700"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="group relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-green-600"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={isLoading}
                      className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-400 transition-all duration-200 hover:scale-110 hover:text-gray-700 disabled:cursor-not-allowed"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      <span className="transition-transform duration-200">
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    id="remember"
                    type="checkbox"
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />

                  <label
                    htmlFor="remember"
                    className="cursor-pointer text-sm text-gray-500"
                  >
                    Remember me
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-green-600 text-sm font-semibold text-white shadow-sm shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 active:translate-y-0 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />

                  <span className="relative flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight
                          size={17}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Register */}
              <p className="mt-7 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-green-600 transition hover:text-green-700"
                >
                  Create an account
                </Link>
              </p>

              {/* Owner CTA */}
              <div className="group relative mt-8 overflow-hidden rounded-2xl border border-green-100 bg-green-50/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:shadow-md hover:shadow-green-900/5">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-500/10 blur-2xl transition duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Own a turf?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        List your turf on Khelaro and
                        manage bookings online.
                      </p>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm transition duration-300 group-hover:scale-105 group-hover:rotate-3">
                      <ShieldCheck size={17} />
                    </div>
                  </div>

                  <Link
                    to="/register?role=owner"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-600 transition-all duration-200 hover:gap-2 hover:text-green-700"
                  >
                    Become a turf owner
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes loginSlideUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes loginShake {
            0%, 100% {
              transform: translateX(0);
            }
            20% {
              transform: translateX(-5px);
            }
            40% {
              transform: translateX(5px);
            }
            60% {
              transform: translateX(-3px);
            }
            80% {
              transform: translateX(3px);
            }
          }

          @keyframes loginFloatOne {
            0%, 100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(18px, 20px);
            }
          }

          @keyframes loginFloatTwo {
            0%, 100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(-20px, -16px);
            }
          }

          .login-glow {
            position: absolute;
            border-radius: 9999px;
            filter: blur(70px);
            pointer-events: none;
          }

          .login-glow-one {
            width: 260px;
            height: 260px;
            top: -100px;
            right: -80px;
            background: rgba(22, 163, 74, 0.12);
            animation: loginFloatOne 7s ease-in-out infinite;
          }

          .login-glow-two {
            width: 300px;
            height: 300px;
            bottom: -150px;
            left: -120px;
            background: rgba(34, 197, 94, 0.09);
            animation: loginFloatTwo 9s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .login-card,
            .login-content,
            .login-field,
            .login-glow,
            .login-panel * {
              animation: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
    </main>
  );
};

export default Login;