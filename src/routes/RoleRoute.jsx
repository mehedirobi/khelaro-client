import { Navigate, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Normalize allowed roles
  const normalizedRoles = allowedRoles.map((role) =>
    String(role).trim().toLowerCase()
  );

  // Wait for Firebase authentication
  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50 px-4">
        <div className="flex flex-col items-center text-center">
          {/* Animated security icon */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-green-500/10" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-green-100 bg-white text-green-600 shadow-sm">
              <ShieldCheck
                size={28}
                strokeWidth={1.8}
                className="animate-pulse"
              />
            </div>
          </div>

          <h2 className="mt-5 text-sm font-semibold text-gray-900">
            Verifying access
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Checking your account permissions...
          </p>

          <div className="mt-5 h-1 w-32 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-[roleLoading_1.2s_ease-in-out_infinite] rounded-full bg-green-600" />
          </div>
        </div>

        <style>
          {`
            @keyframes roleLoading {
              0% {
                transform: translateX(-100%);
              }

              50% {
                transform: translateX(100%);
              }

              100% {
                transform: translateX(250%);
              }
            }
          `}
        </style>
      </main>
    );
  }

  // Not authenticated
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Get MongoDB user information
  const savedUser = localStorage.getItem("khelaro-user");

  if (!savedUser) {
    console.warn("Khelaro user profile not found.");

    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  let userData;

  try {
    userData = JSON.parse(savedUser);
  } catch (error) {
    console.error("Invalid Khelaro user data:", error);

    localStorage.removeItem("khelaro-user");
    localStorage.removeItem("khelaro-uid");

    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Normalize current user's role
  const userRole = String(userData?.role || "")
    .trim()
    .toLowerCase();

  // Invalid or unauthorized role
  if (
    !userRole ||
    !normalizedRoles.includes(userRole)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // Authorized
  return children;
};

export default RoleRoute;