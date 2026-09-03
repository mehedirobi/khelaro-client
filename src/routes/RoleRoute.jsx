import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  // Firebase auth state check হওয়া পর্যন্ত wait
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  // Login না করা থাকলে
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // MongoDB user data
  const savedUser = localStorage.getItem("khelaro-user");

  if (!savedUser) {
    return <Navigate to="/" replace />;
  }

  let userData;

  try {
    userData = JSON.parse(savedUser);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("khelaro-user");

    return <Navigate to="/" replace />;
  }

  // User-এর role allowed কিনা
  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;