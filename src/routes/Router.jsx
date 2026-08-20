import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

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


const router = createBrowserRouter([
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

      {
        path: "turfs/:id/book",
        element: <BookingSection />,
      },
      {
        path: "/booking/:id",
        element: <BookingConfirmation />,
      },
      {
        path: "/payment/:id",
        element: <Payment />,
      },
      {
        path: "/booking-success/:id",
        element: <BookingSuccess />,
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
]);

export default router;
