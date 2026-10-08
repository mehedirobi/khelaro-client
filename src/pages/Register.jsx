import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Building2,
} from "lucide-react";

import { AuthContext } from "../contexts/AuthProvider";
import { useContext } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const userRole =
        role === "customer" ? "user" : "owner";

      const firebaseUser = await register(
        name,
        email,
        password
      );

      const userInfo = {
        uid: firebaseUser.uid,
        name,
        email,
        phone,
        role: userRole,
      };

      const response = await fetch(
        "http://localhost:3000/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to save user information."
        );
      }

      setTimeout(() => {
        navigate(
          userRole === "owner"
            ? "/owner-dashboard"
            : "/dashboard"
        );
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      if (
        error.message ===
        "Failed to save user information."
      ) {
        setError(
          "Account created, but we couldn't save your profile. Please contact support."
        );
      } else if (
        error.message?.includes(
          "Failed to save user information"
        )
      ) {
        setError(error.message);
      } else if (
        error.message?.includes("NetworkError") ||
        error.message?.includes("Failed to fetch")
      ) {
        setError(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      }
    }
  };

  const getPasswordStrength = () => {
    const password =
      document.getElementById("password")?.value || "";

    if (!password) {
      return {
        label: "",
        width: "0%",
        text: "text-gray-400",
      };
    }

    if (password.length < 6) {
      return {
        label: "Weak password",
        width: "30%",
        text: "text-red-500",
      };
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return {
        label: "Strong password",
        width: "100%",
        text: "text-green-600",
      };
    }

    return {
      label: "Good password",
      width: "65%",
      text: "text-amber-500",
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <main className="min-h-[calc(100vh-72px)] overflow-hidden bg-gray-50">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40 lg:grid-cols-2">
          {/* =========================
              LEFT BRAND PANEL
          ========================== */}
          <section className="relative hidden overflow-hidden bg-gray-950 p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
            {/* Background decoration */}
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />

            <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />

            <div className="absolute right-20 top-1/2 h-32 w-32 rounded-full border border-green-500/10" />

            <div className="relative z-10 animate-[fadeIn_0.7s_ease-out]">
              {/* Logo */}
              <Link
                to="/"
                className="group inline-flex items-center gap-2.5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white shadow-lg shadow-green-600/20 transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                  K
                </div>

                <span className="text-xl font-bold tracking-tight text-white">
                  Khelaro
                </span>
              </Link>

              {/* Hero content */}
              <div className="mt-24 max-w-lg">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
                  <Sparkles size={13} />
                  Built for the game
                </div>

                <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-white xl:text-5xl">
                  Find your turf.
                  <br />
                  <span className="text-green-500">
                    Book your game.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-gray-400">
                  Join Khelaro and discover a simpler way
                  to find, compare, and book sports turfs
                  around Dhaka.
                </p>
              </div>

              {/* Feature cards */}
              <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  {
                    icon: CheckCircle2,
                    title: "Discover turfs",
                    text: "Find nearby playing grounds",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Book securely",
                    text: "Simple and reliable booking",
                  },
                  {
                    icon: Sparkles,
                    title: "Play more",
                    text: "Spend less time searching",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-500/20 hover:bg-white/[0.06]"
                      style={{
                        animation: `slideUp 0.5s ease-out ${
                          0.15 + index * 0.1
                        }s both`,
                      }}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400 transition group-hover:scale-105">
                        <Icon size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="relative z-10 text-xs text-gray-600">
              © {new Date().getFullYear()} Khelaro. All
              rights reserved.
            </p>
          </section>

          {/* =========================
              REGISTER PANEL
          ========================== */}
          <section className="flex items-center p-6 sm:p-10 lg:p-12 xl:p-14">
            <div className="mx-auto w-full max-w-md">
              {/* Mobile logo */}
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-2.5 lg:hidden"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white shadow-md shadow-green-600/20">
                  K
                </div>

                <span className="text-xl font-bold text-gray-900">
                  Khelaro
                </span>
              </Link>

              {/* Heading */}
              <div className="animate-[slideUp_0.5s_ease-out]">
                <p className="text-sm font-semibold text-green-600">
                  Get started
                </p>

                <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-gray-900">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Join Khelaro and start booking your
                  next game.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 flex animate-[shake_0.4s_ease-in-out] items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <p className="text-sm leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4"
              >
                {/* Account type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Account type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Customer */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setRole("customer")
                      }
                      className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
                        role === "customer"
                          ? "border-green-500 bg-green-50 shadow-sm shadow-green-500/10"
                          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            role === "customer"
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          }`}
                        >
                          <UserRound size={17} />
                        </div>

                        {role === "customer" && (
                          <CheckCircle2
                            size={18}
                            className="animate-[scaleIn_0.2s_ease-out] text-green-600"
                          />
                        )}
                      </div>

                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        Customer
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Book sports turfs
                      </p>
                    </button>

                    {/* Owner */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setRole("owner")}
                      className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
                        role === "owner"
                          ? "border-green-500 bg-green-50 shadow-sm shadow-green-500/10"
                          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            role === "owner"
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          }`}
                        >
                          <Building2 size={17} />
                        </div>

                        {role === "owner" && (
                          <CheckCircle2
                            size={18}
                            className="animate-[scaleIn_0.2s_ease-out] text-green-600"
                          />
                        )}
                      </div>

                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        Turf Owner
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Manage your turfs
                      </p>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full name
                  </label>

                  <div className="group relative">
                    <UserRound
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-green-600"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="group relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-green-600"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone number
                  </label>

                  <div className="group relative">
                    <Phone
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-green-600"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+880 1XXXXXXXXX"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <div className="group relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-green-600"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Create a password"
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                      onInput={() => {
                        // Force a lightweight re-render for strength text.
                        setError((current) => current);
                      }}
                    />

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:scale-110 hover:text-gray-700"
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

                  {passwordStrength.label && (
                    <div className="mt-2">
                      <div className="h-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all duration-300"
                          style={{
                            width:
                              passwordStrength.width,
                          }}
                        />
                      </div>

                      <p
                        className={`mt-1 text-[11px] font-medium ${passwordStrength.text}`}
                      >
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Confirm password
                  </label>

                  <div className="group relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-green-600"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                    />

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:scale-110 hover:text-gray-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    disabled={loading}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-gray-500"
                  >
                    I agree to Khelaro's{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-green-600 transition hover:text-green-700"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-green-600 transition hover:text-green-700"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-green-600 text-sm font-semibold text-white shadow-lg shadow-green-600/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/20 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {/* Button shine */}
                  {!loading && (
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  )}

                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <span className="relative">
                        Create account
                      </span>

                      <ArrowRight
                        size={17}
                        className="relative transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Login */}
              <p className="mt-7 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-green-600 transition hover:text-green-700"
                >
                  Sign in
                </Link>
              </p>

              {/* Security note */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} />
                Your account information is securely protected.
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-5px);
          }

          75% {
            transform: translateX(5px);
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
    </main>
  );
};

export default Register;