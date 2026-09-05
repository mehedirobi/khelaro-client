import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

import { AuthContext } from "../contexts/AuthProvider";

const MyTurfs = () => {
  const { currentUser } = useContext(AuthContext);

  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    const fetchMyTurfs = async () => {
      if (!currentUser?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:3000/owner/turfs/${encodeURIComponent(
            currentUser.email
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to load turfs");
        }

        const data = await response.json();

        setTurfs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch my turfs error:", error);
        toast.error("Failed to load your turfs.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTurfs();
  }, [currentUser?.email]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this turf?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(id);

      const response = await fetch(
        `http://localhost:3000/turfs/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete turf");
      }

      setTurfs((prev) =>
        prev.filter((turf) => turf._id !== id)
      );

      toast.success("Turf deleted successfully.");
    } catch (error) {
      console.error("Delete turf error:", error);
      toast.error(error.message || "Failed to delete turf.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-green-50 text-green-700 border-green-200";

      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          Loading your turfs...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My Turfs
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all your turf listings from here.
          </p>
        </div>

        <Link
          to="/owner-dashboard/add-turf"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <Plus size={18} />
          Add New Turf
        </Link>
      </div>

      {/* Empty State */}
      {turfs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <MapPin size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No turfs yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            You haven't added any turf yet. Add your first turf
            and start managing your bookings.
          </p>

          <Link
            to="/owner-dashboard/add-turf"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Plus size={17} />
            Add Turf
          </Link>
        </div>
      ) : (
        <>
          {/* Turf Count */}
          <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={17} />
            <span>
              {turfs.length} {turfs.length === 1 ? "turf" : "turfs"} found
            </span>
          </div>

          {/* Turf Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {turfs.map((turf) => (
              <div
                key={turf._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {turf.image ? (
                    <img
                      src={turf.image}
                      alt={turf.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <MapPin size={40} />
                    </div>
                  )}

                  {/* Status */}
                  <span
                    className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                      turf.status
                    )}`}
                  >
                    {turf.status || "unknown"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="truncate text-lg font-semibold text-gray-900">
                    {turf.name}
                  </h2>

                  <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <span className="line-clamp-2">
                      {turf.location || "Location not available"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        Price / hour
                      </p>

                      <p className="mt-1 text-base font-bold text-gray-900">
                        ৳{Number(turf.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        Surface
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {turf.surface || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link
                      to={`/owner-dashboard/turfs/edit/${turf._id}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(turf._id)}
                      disabled={deleteLoading === turf._id}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deleteLoading === turf._id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}

                      Delete
                    </button>
                  </div>

                  {/* Booking Button */}
                  <Link
                    to={`/owner-dashboard/bookings?turfId=${turf._id}`}
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    <CalendarDays size={16} />
                    View Bookings
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyTurfs;