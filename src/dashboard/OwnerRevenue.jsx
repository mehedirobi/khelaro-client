import { useContext, useEffect, useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  CalendarDays,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import { AuthContext } from "../contexts/AuthProvider";

const OwnerRevenue = () => {
  const { currentUser } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      if (!currentUser?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const turfResponse = await fetch(
          `http://localhost:3000/owner/turfs/${encodeURIComponent(
            currentUser.email
          )}`
        );

        if (!turfResponse.ok) {
          throw new Error("Failed to load turfs");
        }

        const turfs = await turfResponse.json();

        if (!Array.isArray(turfs) || turfs.length === 0) {
          setBookings([]);
          return;
        }

        const requests = turfs.map((turf) =>
          fetch(
            `http://localhost:3000/bookings/turf/${turf._id}`
          ).then((res) => {
            if (!res.ok) {
              throw new Error("Failed to load bookings");
            }

            return res.json();
          })
        );

        const results = await Promise.all(requests);

        setBookings(results.flat());
      } catch (error) {
        console.error("Revenue error:", error);
        toast.error("Failed to load revenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [currentUser?.email]);

  const stats = useMemo(() => {
    const confirmedBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed"
    );

    const paidBookings = confirmedBookings.filter(
      (booking) =>
        booking.paymentStatus === "paid"
    );

    const totalRevenue = paidBookings.reduce(
      (total, booking) =>
        total + Number(booking.price || 0),
      0
    );

    const confirmedRevenue = confirmedBookings.reduce(
      (total, booking) =>
        total + Number(booking.price || 0),
      0
    );

    return {
      totalRevenue,
      confirmedRevenue,
      paidBookings: paidBookings.length,
      confirmedBookings: confirmedBookings.length,
    };
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading revenue...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Revenue
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track your turf booking earnings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Revenue
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ৳
                {stats.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Wallet size={21} />
            </div>
          </div>
        </div>

        {/* Paid bookings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Paid Bookings
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.paidBookings}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        {/* Confirmed bookings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Confirmed Bookings
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.confirmedBookings}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CalendarDays size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue summary */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <TrendingUp size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Revenue Summary
            </h2>

            <p className="text-sm text-gray-500">
              Based on your current booking data.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              Paid & Confirmed Revenue
            </p>

            <p className="mt-2 text-xl font-bold text-gray-900">
              ৳
              {stats.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              Confirmed Booking Value
            </p>

            <p className="mt-2 text-xl font-bold text-gray-900">
              ৳
              {stats.confirmedRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerRevenue;