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
} from "lucide-react";

import { AuthContext } from "../contexts/AuthProvider.jsx";

// =====================================================
// API CONFIG
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// =====================================================
// LOGIN COMPONENT
// =====================================================

const Login = () => {
  const navigate = useNavigate();

  const { login, loading: authLoading } =
    useContext(AuthContext);

  // ===================================================
  // STATE
  // ===================================================

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoading = loading || authLoading;

  // ===================================================
  // HANDLE INPUT CHANGE
  // ===================================================

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

  // ===================================================
  // GET USER FROM MONGODB
  // ===================================================

  const getMongoUser = async (email) => {
    if (!email) {
      throw new Error(
        "Firebase account email was not found."
      );
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

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

      throw new Error(
        "BACKEND_CONNECTION_ERROR"
      );
    }

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    // -----------------------------------------------
    // USER NOT FOUND
    // -----------------------------------------------

    if (response.status === 404) {
      throw new Error(
        "USER_PROFILE_NOT_FOUND"
      );
    }

    // -----------------------------------------------
    // OTHER BACKEND ERROR
    // -----------------------------------------------

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to load user profile."
      );
    }

    // -----------------------------------------------
    // BACKEND RESPONSE
    //
    // Your backend returns:
    //
    // {
    //   success: true,
    //   user: {...}
    // }
    // -----------------------------------------------

    const user = data?.user;

    if (!user || !user.email) {
      throw new Error(
        "USER_PROFILE_NOT_FOUND"
      );
    }

    // -----------------------------------------------
    // VERIFY EMAIL
    // -----------------------------------------------

    const databaseEmail = user.email
      .trim()
      .toLowerCase();

    if (databaseEmail !== normalizedEmail) {
      console.error("Email mismatch:", {
        firebaseEmail: normalizedEmail,
        databaseEmail,
      });

      throw new Error(
        "USER_EMAIL_MISMATCH"
      );
    }

    return user;
  };

  // ===================================================
  // REDIRECT USER BASED ON ROLE
  // ===================================================

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

  // ===================================================
  // HANDLE LOGIN
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email
      .trim()
      .toLowerCase();

    const password = formData.password;

    // -----------------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------------

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      // =============================================
      // 1. FIREBASE LOGIN
      // =============================================

      const firebaseUser = await login(
        email,
        password
      );

      if (!firebaseUser) {
        throw new Error(
          "Firebase login failed. Please try again."
        );
      }

      // =============================================
      // 2. GET FIREBASE EMAIL
      // =============================================

      const firebaseEmail =
        firebaseUser.email
          ?.trim()
          .toLowerCase();

      if (!firebaseEmail) {
        throw new Error(
          "Firebase account email was not found."
        );
      }

      // =============================================
      // 3. GET USER FROM MONGODB
      // =============================================

      const mongoUser =
        await getMongoUser(firebaseEmail);

      // =============================================
      // 4. VALIDATE ROLE
      // =============================================

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

      // =============================================
      // 5. CREATE FINAL USER OBJECT
      // =============================================

      const finalUserData = {
        ...mongoUser,

        // Firebase values
        uid:
          firebaseUser.uid ||
          mongoUser.uid ||
          "",

        email: firebaseEmail,

        // MongoDB role
        role,
      };

      // =============================================
      // 6. SAVE USER LOCALLY
      // =============================================

      localStorage.setItem(
        "khelaro-user",
        JSON.stringify(finalUserData)
      );

      localStorage.setItem(
        "khelaro-uid",
        firebaseUser.uid
      );

      // =============================================
      // 7. REDIRECT
      // =============================================

      redirectUser(finalUserData);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      // =============================================
      // MONGODB PROFILE NOT FOUND
      // =============================================

      if (
        error.message ===
        "USER_PROFILE_NOT_FOUND"
      ) {
        setError(
          "Login successful, but your Khelaro user profile was not found. Please complete registration first."
        );

        return;
      }

      // =============================================
      // EMAIL MISMATCH
      // =============================================

      if (
        error.message ===
        "USER_EMAIL_MISMATCH"
      ) {
        setError(
          "Firebase email and Khelaro profile email do not match."
        );

        return;
      }

      // =============================================
      // BACKEND CONNECTION ERROR
      // =============================================

      if (
        error.message ===
        "BACKEND_CONNECTION_ERROR"
      ) {
        setError(
          "Unable to connect to Khelaro server. Please make sure the backend is running on port 3000."
        );

        return;
      }

      // =============================================
      // INVALID ROLE
      // =============================================

      if (
        error.message ===
        "INVALID_ROLE"
      ) {
        setError(
          "Your account has an invalid role. Please contact the administrator."
        );

        return;
      }

      // =============================================
      // FIREBASE AUTH ERRORS
      // =============================================

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

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-[calc(100vh-72px)] overflow-hidden bg-gray-50">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">

        <div
          className="
            grid w-full max-w-5xl overflow-hidden rounded-3xl
            border border-gray-200 bg-white shadow-sm
            animate-[fadeIn_0.5s_ease-out]
            lg:grid-cols-2
          "
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div
            className="
              relative hidden overflow-hidden
              bg-gray-950 p-10
              lg:flex lg:flex-col lg:justify-between
            "
          >

            <div className="relative z-10">

              {/* Logo */}

              <Link
                to="/"
                className="
                  inline-flex items-center gap-2
                  transition-transform duration-200
                  hover:scale-105
                "
              >
                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl bg-green-600
                    text-lg font-bold text-white
                  "
                >
                  K
                </div>

                <span className="text-xl font-bold text-white">
                  Khelaro
                </span>
              </Link>

              {/* Hero Text */}

              <div className="mt-24 max-w-md">

                <p
                  className="
                    mb-4 text-sm font-semibold
                    uppercase tracking-wider
                    text-green-400
                  "
                >
                  Play more. Worry less.
                </p>

                <h1
                  className="
                    text-4xl font-bold
                    leading-tight tracking-tight
                    text-white
                  "
                >
                  Your next game is
                  <span className="text-green-500">
                    {" "}just a booking away.
                  </span>
                </h1>

                <p
                  className="
                    mt-5 text-base leading-7
                    text-gray-400
                  "
                >
                  Find the best turfs around Dhaka,
                  check availability, and book your
                  preferred playing slot with ease.
                </p>

              </div>
            </div>

            {/* Features */}

            <div
              className="
                relative z-10 flex items-center
                gap-6 border-t border-gray-800
                pt-6
              "
            >

              <div
                className="
                  flex items-center gap-2
                  text-sm text-gray-400
                "
              >
                <CheckCircle2
                  size={17}
                  className="text-green-500"
                />

                Verified turfs
              </div>

              <div
                className="
                  flex items-center gap-2
                  text-sm text-gray-400
                "
              >
                <CheckCircle2
                  size={17}
                  className="text-green-500"
                />

                Easy booking
              </div>

            </div>

            {/* Background Glow */}

            <div
              className="
                absolute -right-24 -top-24
                h-72 w-72 rounded-full
                bg-green-600/10 blur-3xl
              "
            />

            <div
              className="
                absolute -bottom-32 -left-20
                h-80 w-80 rounded-full
                bg-green-500/10 blur-3xl
              "
            />

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div
            className="
              flex items-center
              p-6 sm:p-10 lg:p-12
            "
          >

            <div className="mx-auto w-full max-w-md">

              {/* Mobile Logo */}

              <Link
                to="/"
                className="
                  mb-10 inline-flex items-center gap-2
                  transition-transform duration-200
                  hover:scale-105
                  lg:hidden
                "
              >

                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl bg-green-600
                    text-lg font-bold text-white
                  "
                >
                  K
                </div>

                <span className="text-xl font-bold text-gray-900">
                  Khelaro
                </span>

              </Link>

              {/* Heading */}

              <div
                className="
                  animate-[slideUp_0.5s_ease-out]
                "
              >

                <h2
                  className="
                    text-3xl font-bold
                    tracking-tight text-gray-900
                  "
                >
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Sign in to manage your bookings
                  and find your next game.
                </p>

              </div>

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div
                  role="alert"
                  className="
                    mt-6 flex items-start gap-3
                    rounded-xl border border-red-200
                    bg-red-50 p-4
                    animate-[shake_0.3s_ease-in-out]
                  "
                >

                  <AlertCircle
                    size={18}
                    className="
                      mt-0.5 shrink-0
                      text-red-500
                    "
                  />

                  <p
                    className="
                      text-sm leading-5
                      text-red-600
                    "
                  >
                    {error}
                  </p>

                </div>
              )}

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="
                  mt-8 space-y-5
                  animate-[slideUp_0.6s_ease-out]
                "
              >

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="
                      mb-2 block text-sm
                      font-medium text-gray-700
                    "
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="
                        absolute left-3.5 top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
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
                      className="
                        h-12 w-full rounded-xl
                        border border-gray-200
                        bg-white pl-11 pr-4
                        text-sm text-gray-900
                        outline-none transition-all duration-200
                        placeholder:text-gray-400
                        focus:border-green-500
                        focus:ring-4
                        focus:ring-green-500/10
                        disabled:cursor-not-allowed
                        disabled:bg-gray-50
                      "
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <div
                    className="
                      mb-2 flex items-center
                      justify-between
                    "
                  >

                    <label
                      htmlFor="password"
                      className="
                        block text-sm
                        font-medium text-gray-700
                      "
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="
                        text-xs font-medium
                        text-green-600
                        transition-colors
                        hover:text-green-700
                      "
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="
                        absolute left-3.5 top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
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
                      className="
                        h-12 w-full rounded-xl
                        border border-gray-200
                        bg-white pl-11 pr-12
                        text-sm text-gray-900
                        outline-none transition-all duration-200
                        placeholder:text-gray-400
                        focus:border-green-500
                        focus:ring-4
                        focus:ring-green-500/10
                        disabled:cursor-not-allowed
                        disabled:bg-gray-50
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={isLoading}
                      className="
                        absolute right-3.5 top-1/2
                        -translate-y-1/2
                        text-gray-400
                        transition-colors
                        hover:text-gray-700
                        disabled:cursor-not-allowed
                      "
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>

                {/* Remember Me */}

                <div className="flex items-center gap-2">

                  <input
                    id="remember"
                    type="checkbox"
                    disabled={isLoading}
                    className="
                      h-4 w-4 rounded
                      border-gray-300
                      text-green-600
                      focus:ring-green-500
                    "
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-500"
                  >
                    Remember me
                  </label>

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    group flex h-12 w-full
                    items-center justify-center gap-2
                    rounded-xl bg-green-600
                    text-sm font-semibold text-white
                    transition-all duration-200
                    hover:bg-green-700
                    hover:shadow-lg
                    hover:shadow-green-600/20
                    active:scale-[0.98]
                    focus:outline-none
                    focus:ring-4
                    focus:ring-green-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                >

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
                        className="
                          transition-transform
                          duration-200
                          group-hover:translate-x-1
                        "
                      />
                    </>
                  )}

                </button>

              </form>

              {/* Register */}

              <p
                className="
                  mt-8 text-center
                  text-sm text-gray-500
                "
              >
                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="
                    font-semibold
                    text-green-600
                    transition-colors
                    hover:text-green-700
                  "
                >
                  Create an account
                </Link>

              </p>

              {/* Owner CTA */}

              <div
                className="
                  mt-8 rounded-2xl
                  border border-green-100
                  bg-green-50 p-4
                  transition-all duration-200
                  hover:border-green-200
                  hover:shadow-sm
                "
              >

                <p className="text-sm font-semibold text-gray-900">
                  Own a turf?
                </p>

                <p
                  className="
                    mt-1 text-xs leading-5
                    text-gray-500
                  "
                >
                  List your turf on Khelaro and start
                  managing bookings online.
                </p>

                <Link
                  to="/register?role=owner"
                  className="
                    mt-3 inline-flex
                    items-center gap-1
                    text-xs font-semibold
                    text-green-600
                    transition-colors
                    hover:text-green-700
                  "
                >
                  Become a turf owner

                  <ArrowRight size={14} />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }

            25% {
              transform: translateX(-4px);
            }

            50% {
              transform: translateX(4px);
            }

            75% {
              transform: translateX(-2px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;