import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Turfs from "./pages/Turfs";
import TurfDetails from "./pages/TurfDetails";
import BookingSection from "./pages/BookingSection";
import BookingConfirmation from "./pages/BookingConfirmation";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Customer
import Dashboard from "./pages/Dashboard";

// Owner
import OwnerDashboard from "./pages/OwnerDashboard";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTurfs from "./pages/admin/AdminTurfs";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRevenue from "./pages/admin/AdminRevenue";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import OwnerDashboardLayout from "./layouts/OwnerDashboardLayout";

// Route protection
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import OwnerRoute from "./routes/OwnerRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC WEBSITE ================= */}

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

        {/* Turf details */}
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

        {/* Turf booking */}
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

        {/* Booking confirmation */}
        <Route
          path="/booking/:id"
          element={
            <>
              <Navbar />
              <BookingConfirmation />
              <Footer />
            </>
          }
        />

        {/* Payment */}
        <Route
          path="/payment/:id"
          element={
            <>
              <Navbar />
              <Payment />
              <Footer />
            </>
          }
        />

        {/* Booking success */}
        <Route
          path="/booking-success/:id"
          element={
            <>
              <Navbar />
              <BookingSuccess />
              <Footer />
            </>
          }
        />

        {/* ================= AUTH ================= */}

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

        {/* ================= CUSTOMER ================= */}

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

        {/* ================= OWNER ================= */}

        <Route
          path="/owner-dashboard"
          element={
            <OwnerRoute>
              <OwnerDashboardLayout />
            </OwnerRoute>
          }
        >
          <Route
            index
            element={<OwnerDashboard />}
          />
        </Route>

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboardLayout />
            </AdminRoute>
          }
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

          <Route
            path="turfs"
            element={<AdminTurfs />}
          />

          <Route
            path="bookings"
            element={<AdminBookings />}
          />

          <Route
            path="revenue"
            element={<AdminRevenue />}
          />
        </Route>

        {/* ================= 404 ================= */}

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
                  className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
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