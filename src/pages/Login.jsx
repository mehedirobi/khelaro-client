import { useState } from "react";
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

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    if (error) {
      setError("");
    }
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { email, password } = formData;

      // 1. Firebase login
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = result.user;

      console.log("Firebase Login Successful:", firebaseUser);

      // 2. Get user profile from MongoDB
      const response = await fetch(
        `http://localhost:3000/users/${encodeURIComponent(
          firebaseUser.email
        )}`
      );

      if (!response.ok) {
        throw new Error("User profile not found in database.");
      }

      const userData = await response.json();

      console.log("MongoDB User:", userData);

      // 3. Save basic user information locally
      localStorage.setItem(
        "khelaro-user",
        JSON.stringify(userData)
      );

      // 4. Redirect based on role
      if (userData.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Something went wrong. Please try again.";

      switch (error.code) {
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password.";
          break;

        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;

        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;

        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;

        case "auth/too-many-requests":
          errorMessage =
            "Too many failed attempts. Please try again later.";
          break;

        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;

        default:
          if (error.message === "User profile not found in database.") {
            errorMessage =
              "Login successful, but your user profile was not found.";
          }
          break;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-50">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-2">

          {/* Left - Branding */}
          <div className="relative hidden overflow-hidden bg-gray-950 p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white">
                  K
                </div>

                <span className="text-xl font-bold text-white">
                  Khelaro
                </span>
              </Link>

              <div className="mt-24 max-w-md">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-green-400">
                  Play more. Worry less.
                </p>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
                  Your next game is
                  <span className="text-green-500">
                    {" "}
                    just a booking away.
                  </span>
                </h1>

                <p className="mt-5 text-base leading-7 text-gray-400">
                  Find the best turfs around Dhaka, check availability,
                  and book your preferred playing slot with ease.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-6 border-t border-gray-800 pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 size={17} className="text-green-500" />
                Verified turfs
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 size={17} className="text-green-500" />
                Easy booking
              </div>
            </div>

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-600/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
          </div>

          {/* Right - Login Form */}
          <div className="flex items-center p-6 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-md">

              {/* Mobile Logo */}
              <Link
                to="/"
                className="mb-10 inline-flex items-center gap-2 lg:hidden"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white">
                  K
                </div>

                <span className="text-xl font-bold text-gray-900">
                  Khelaro
                </span>
              </Link>

              {/* Heading */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Sign in to manage your bookings and find your next game.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <p className="text-sm leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
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
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-green-600 hover:text-green-700"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      disabled={loading}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed"
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

                {/* Remember */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
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
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Register */}
              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-green-600 hover:text-green-700"
                >
                  Create an account
                </Link>
              </p>

              {/* Owner CTA */}
              <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Own a turf?
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  List your turf on Khelaro and start managing bookings
                  online.
                </p>

                <Link
                  to="/register?role=owner"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700"
                >
                  Become a turf owner
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;