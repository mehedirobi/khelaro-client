import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import OwnerDashboardLayout from "../layouts/OwnerDashboardLayout";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";

// Main pages
import Home from "../components/Home";
import Turf from "../components/Turf";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

// Turf & booking pages
import TurfDetails from "../pages/TurfDetails";
import BookingSection from "../pages/BookingSection";
import BookingConfirmation from "../pages/BookingConfirmation";
import BookingDetails from "../dashboard/BookingDetails";
import Payment from "../pages/Payment";
import BookingSuccess from "../pages/BookingSuccess";

// Route guards
import PrivateRoute from "../routes/PrivateRoute";
import RoleRoute from "../routes/RoleRoute";

// Customer dashboard
import DashboardOverview from "../dashboard/DashboardOverview";
import MyBookings from "../dashboard/MyBookings";
import Wishlist from "../dashboard/Wishlist";
import Profile from "../dashboard/Profile";

// Owner dashboard
import OwnerDashboard from "../dashboard/OwnerDashboard";
import AddTurf from "../dashboard/AddTurf";
import MyTurfs from "../dashboard/MyTurfs";
import OwnerBookings from "../dashboard/OwnerBookings";
import OwnerRevenue from "../dashboard/OwnerRevenue";
import OwnerProfile from "../dashboard/OwnerProfile";

// Admin dashboard
import AdminDashboard from "../dashboard/AdminDashboard";
import AdminUsers from "../dashboard/AdminUsers";
import AdminOwners from "../dashboard/AdminOwners";
import AdminTurfs from "../dashboard/AdminTurfs";
import AdminBookings from "../dashboard/AdminBookings";
import AdminRevenue from "../dashboard/AdminRevenue";
import AdminProfile from "../dashboard/AdminProfile";

const router = createBrowserRouter([
  // ==================================================
  // MAIN WEBSITE
  // ==================================================
  {
    path: "/",
    element: <MainLayout />,
    children: [
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

      // Public turf pages
      {
        path: "turfs",
        element: <Turf />,
      },
      {
        path: "turfs/:id",
        element: <TurfDetails />,
      },

      // Booking
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

      // Other public pages
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

  // ==================================================
  // CUSTOMER DASHBOARD
  // ==================================================
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
        path: "bookings/:id",
        element: <BookingDetails />,
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

  // ==================================================
  // OWNER DASHBOARD
  // ==================================================
  {
    path: "/owner-dashboard",
    element: (
      <RoleRoute allowedRoles={["owner"]}>
        <OwnerDashboardLayout />
      </RoleRoute>
    ),
    children: [
      {
        index: true,
        element: <OwnerDashboard />,
      },

      {
        path: "turfs",
        element: <MyTurfs />,
      },

      {
        path: "add-turf",
        element: <AddTurf />,
      },

      {
        path: "bookings",
        element: <OwnerBookings />,
      },

      {
        path: "revenue",
        element: <OwnerRevenue />,
      },

      {
        path: "profile",
        element: <OwnerProfile />,
      },
    ],
  },

  // ==================================================
  // ADMIN DASHBOARD
  // ==================================================
  {
    path: "/admin-dashboard",
    element: (
      <RoleRoute allowedRoles={["admin"]}>
        <AdminDashboardLayout />
      </RoleRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },

      {
        path: "users",
        element: <AdminUsers />,
      },

      {
        path: "owners",
        element: <AdminOwners />,
      },

      {
        path: "turfs",
        element: <AdminTurfs />,
      },

      {
        path: "bookings",
        element: <AdminBookings />,
      },

      {
        path: "revenue",
        element: <AdminRevenue />,
      },

      {
        path: "profile",
        element: <AdminProfile />,
      },
    ],
  },

  // ==================================================
  // 404
  // ==================================================
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;