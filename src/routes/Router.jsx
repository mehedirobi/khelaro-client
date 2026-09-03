import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../components/Home";
import Turf from "../components/Turf";

import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import Contact from "../pages/Contact";

import TurfDetails from "../pages/TurfDetails";
import BookingSection from "../pages/BookingSection";
import BookingConfirmation from "../pages/BookingConfirmation";
import Payment from "../pages/Payment";
import BookingSuccess from "../pages/BookingSuccess";

// Customer Dashboard
import DashboardOverview from "../dashboard/DashboardOverview";
import MyBookings from "../dashboard/MyBookings";
import Wishlist from "../dashboard/Wishlist";
import Profile from "../dashboard/Profile";

// Owner Dashboard
import OwnerDashboard from "../dashboard/OwnerDashboard";

import NotFound from "../pages/NotFound";

import PrivateRoute from "../routes/PrivateRoute";
import RoleRoute from "../routes/RoleRoute";

const router = createBrowserRouter([
  // ========================================
  // MAIN WEBSITE
  // ========================================
  {
    path: "/",
    element: <MainLayout />,

    children: [
      // Home
      {
        index: true,
        element: <Home />,
      },

      // Authentication
      {
        path: "login",
        element: <Login />,
      },

      {
        path: "register",
        element: <Register />,
      },

      // Turfs
      {
        path: "turfs",
        element: <Turf />,
      },

      {
        path: "turfs/:turfId",
        element: <TurfDetails />,
      },

      // ========================================
      // BOOKING ROUTES - LOGIN REQUIRED
      // ========================================

      {
        path: "turfs/:id/book",
        element: (
          <PrivateRoute>
            <BookingSection />
          </PrivateRoute>
        ),
      },

      {
        path: "booking/:id",
        element: (
          <PrivateRoute>
            <BookingConfirmation />
          </PrivateRoute>
        ),
      },

      {
        path: "payment/:id",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },

      {
        path: "booking-success/:id",
        element: (
          <PrivateRoute>
            <BookingSuccess />
          </PrivateRoute>
        ),
      },

      // Other pages
      {
        path: "about",
        element: <About />,
      },

      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },

  // ========================================
  // CUSTOMER DASHBOARD
  // ========================================
  {
    path: "/dashboard",

    element: (
      <RoleRoute allowedRoles={["user"]}>
        <DashboardLayout />
      </RoleRoute>
    ),

    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },

      {
        path: "bookings",
        element: <MyBookings />,
      },

      {
        path: "wishlist",
        element: <Wishlist />,
      },

      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },

  // ========================================
  // OWNER DASHBOARD
  // ========================================
  {
    path: "/owner-dashboard",

    element: (
      <RoleRoute allowedRoles={["owner"]}>
        <DashboardLayout />
      </RoleRoute>
    ),

    children: [
      {
        index: true,
        element: <OwnerDashboard />,
      },
    ],
  },

  // ========================================
  // 404
  // ========================================
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;