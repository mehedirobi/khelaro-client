import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("customer");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Firebase registration will be added here later
    console.log("Register submitted", { role });
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
                  Built for the game
                </p>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
                  Find your turf.
                  <br />
                  <span className="text-green-500">
                    Book your game.
                  </span>
                </h1>

                <p className="mt-5 text-base leading-7 text-gray-400">
                  Join Khelaro and make turf booking around Dhaka
                  simple, fast, and reliable.
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-3 border-t border-gray-800 pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 size={17} className="text-green-500" />
                Discover nearby turfs
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 size={17} className="text-green-500" />
                Check available slots
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 size={17} className="text-green-500" />
                Book with confidence
              </div>
            </div>

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-600/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
          </div>

          {/* Right - Register Form */}
          <div className="flex items-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md mx-auto">

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

              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Join Khelaro and start booking your next game.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">

                {/* Account Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Account type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("customer")}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        role === "customer"
                          ? "border-green-500 bg-green-50 ring-2 ring-green-500/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        Customer
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Book turfs
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("owner")}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        role === "owner"
                          ? "border-green-500 bg-green-50 ring-2 ring-green-500/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        Turf Owner
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Manage turfs
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

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
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
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
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

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+880 1XXXXXXXXX"
                      className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
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

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
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

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
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
                      className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
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
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-gray-500"
                  >
                    I agree to Khelaro's{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-green-600 hover:text-green-700"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-green-600 hover:text-green-700"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/20"
                >
                  Create account

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-green-600 hover:text-green-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
