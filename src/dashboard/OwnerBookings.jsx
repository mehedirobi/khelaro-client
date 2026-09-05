import { useContext, useEffect, useState } from "react";
import {
  CalendarDays,
  Loader2,
  MapPin,
  Clock3,
  UserRound,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { AuthContext } from "../contexts/AuthProvider";

const OwnerBookings = () => {
  const { currentUser } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get owner's turfs
        const turfResponse = await fetch(
          `http://localhost:3000/owner/turfs/${encodeURIComponent(
            currentUser.email
          )}`
        );

        if (!turfResponse.ok) {
          throw new Error("Failed to load owner turfs");
        }

        const turfs = await turfResponse.json();

        if (!Array.isArray(turfs) || turfs.length === 0) {
          setBookings([]);
          return;
        }

        // Get bookings for every turf
        const bookingRequests = turfs.map((turf) =>
          fetch(
            `http://localhost:3000/bookings/turf/${turf._id}`
          ).then((response) => {
            if (!response.ok) {
              throw new Error("Failed to load turf bookings");
            }

            return response.json();
          })
        );

        const bookingResults = await Promise.all(bookingRequests);

        const allBookings = bookingResults
          .flat()
          .sort(
            (a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
          );

        setBookings(allBookings);
      } catch (error) {
        console.error("Owner bookings error:", error);
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser?.email]);

  const updateBookingStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const response = await fetch(
        `http://localhost:3000/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update booking"
        );
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id
            ? {
                ...booking,
                status,
              }
            : booking
        )
      );

      toast.success(
        `Booking ${status} successfully.`
      );
    } catch (error) {
      console.error("Update booking error:", error);
      toast.error(
        error.message || "Failed to update booking."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "border-green-200 bg-green-50 text-green-700";

      case "pending":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading bookings...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Bookings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage bookings made for your turfs.
        </p>
      </div>

      {/* Empty */}
      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <CalendarDays size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No bookings yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Customer bookings for your turfs will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                {/* Booking info */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {booking.turfName ||
                        "Turf Booking"}
                    </h2>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays
                        size={16}
                        className="text-green-600"
                      />
                      {booking.date}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock3
                        size={16}
                        className="text-green-600"
                      />
                      {booking.startTime} -{" "}
                      {booking.endTime}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <UserRound
                        size={16}
                        className="text-green-600"
                      />
                      {booking.userName ||
                        booking.userEmail}
                    </div>

                    {booking.userPhone && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone
                          size={16}
                          className="text-green-600"
                        />
                        {booking.userPhone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price + actions */}
                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <div>
                    <p className="text-xs text-gray-400">
                      Booking Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      ৳
                      {Number(
                        booking.price || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={
                          updatingId === booking._id
                        }
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "confirmed"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingId === booking._id ? (
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                        Confirm
                      </button>

                      <button
                        type="button"
                        disabled={
                          updatingId === booking._id
                        }
                        onClick={() =>
                          updateBookingStatus(
                            booking._id,
                            "cancelled"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <XCircle size={15} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;