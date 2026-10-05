import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./pages/Home";
import Turfs from "./pages/Turfs";
import TurfDetails from "./pages/TurfDetails";
import BookingSection from "./pages/BookingSection";
v
// =====================================================
// AUTH PAGES
// =====================================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// =====================================================
// CUSTOMER
// =====================================================

import Dashboard from "./pages/Dashboard";

// =====================================================
// OWNER
// =====================================================

import OwnerDashboard from "./pages/OwnerDashboard";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTurfs from "./pages/admin/AdminTurfs";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRevenue from "./pages/admin/AdminRevenue";

// =====================================================
// LAYOUTS
// =====================================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import OwnerDashboardLayout from "./layouts/OwnerDashboardLayout";

// =====================================================
// ROUTE PROTECTION
// =====================================================

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import OwnerRoute from "./routes/OwnerRoute";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================
            PUBLIC WEBSITE
        ================================================= */}

        {/* Home */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        {/* All Turfs */}
        <Route
          path="/turfs"
          element={
            <>
              <Navbar />
              <Turfs />
              <Footer />
            </>
          }
        />

        {/* Turf Details */}
        <Route
          path="/turfs/:id"
          element={
            <>
              <Navbar />
              <TurfDetails />
              <Footer />
            </>
          }
        />

        {/* Turf Booking / Availability */}
        <Route
          path="/turfs/:id/book"
          element={
            <>
              <Navbar />
              <BookingSection />
              <Footer />
            </>
          }
        />

        {/* =================================================
            AUTH
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* =================================================
            CUSTOMER DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navbar />
              <Dashboard />
              <Footer />
            </PrivateRoute>
          }
        />

        {/* =================================================
            OWNER DASHBOARD
        ================================================= */}

        <Route
          path="/owner-dashboard"
          element={
            <OwnerRoute>
              <OwnerDashboardLayout />
            </OwnerRoute>
          }
        >
          {/* Owner Overview */}
          <Route
            index
            element={<OwnerDashboard />}
          />

          {/* Future Owner Routes */}

          {/*
          <Route
            path="turfs"
            element={<OwnerTurfs />}
          />

          <Route
            path="add-turf"
            element={<AddTurf />}
          />

          <Route
            path="bookings"
            element={<OwnerBookings />}
          />

          <Route
            path="revenue"
            element={<OwnerRevenue />}
          />

          <Route
            path="profile"
            element={<OwnerProfile />}
          />
          */}
        </Route>

        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboardLayout />
            </AdminRoute>
          }
        >
          {/* Overview */}
          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Users */}
          <Route
            path="users"
            element={<AdminUsers />}
          />

          {/* Turfs */}
          <Route
            path="turfs"
            element={<AdminTurfs />}
          />

          {/* Bookings */}
          <Route
            path="bookings"
            element={<AdminBookings />}
          />

          {/* Revenue */}
          <Route
            path="revenue"
            element={<AdminRevenue />}
          />

          {/* Future Admin Routes */}

          {/*
          <Route
            path="owners"
            element={<AdminOwners />}
          />

          <Route
            path="profile"
            element={<AdminProfile />}
          />
          */}
        </Route>

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900">
                  404
                </h1>

                <p className="mt-3 text-gray-500">
                  Page not found.
                </p>

                <a
                  href="/"
                  className="
                    mt-6
                    inline-flex
                    rounded-xl
                    bg-green-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-green-700
                  "
                >
                  Back to Website
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;