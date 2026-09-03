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

import DashboardOverview from "../dashboard/DashboardOverview";
import MyBookings from "../dashboard/MyBookings";
import Wishlist from "../dashboard/Wishlist";
import Profile from "../dashboard/Profile";

import NotFound from "../pages/NotFound";

import PrivateRoute from "../routes/PrivateRoute";

const router = createBrowserRouter([
  // =========================
  // Main Layout
  // =========================
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "login",
        element: <Login />,
      },

      {
        path: "register",
        element: <Register />,
      },

      {
        path: "turfs",
        element: <Turf />,
      },

      {
        path: "turfs/:turfId",
        element: <TurfDetails />,
      },

      // Booking requires login
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

  // =========================
  // Dashboard
  // =========================
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
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

  // =========================
  // 404
  // =========================
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;