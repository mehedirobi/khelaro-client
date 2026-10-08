import { Navigate, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Wait for Firebase authentication state
  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50 px-4">
        <div className="flex flex-col items-center text-center">
          {/* Animated Icon */}
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

          {/* Loading Text */}
          <h2 className="mt-5 text-sm font-semibold text-gray-900">
            Verifying your session
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Please wait a moment...
          </p>

          {/* Progress Indicator */}
          <div className="mt-5 h-1 w-32 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-green-600" />
          </div>
        </div>

        <style>
          {`
            @keyframes loading {
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

  // Redirect unauthenticated users to login
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Authenticated user can access the protected page
  return children;
};

export default PrivateRoute;