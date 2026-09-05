import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Image,
  Users,
  Clock,
  DollarSign,
  FileText,
  ArrowLeft,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const AddTurf = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    description: "",
    image: "",
    pricePerHour: "",
    capacity: "",
    openingTime: "08:00",
    closingTime: "23:00",
    facilities: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setLoading(true);

      const turfInfo = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        pricePerHour: Number(formData.pricePerHour),
        capacity: Number(formData.capacity),
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,

        facilities: formData.facilities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || "",
        ownerEmail: currentUser.email,

        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3000/turfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(turfInfo),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add turf.");
      }

      toast.success("Turf added successfully!");

      navigate("/owner-dashboard/turfs");
    } catch (error) {
      console.error("Add turf error:", error);

      toast.error(
        error.message || "Failed to add turf. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/owner-dashboard")}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Add New Turf
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add your turf information so customers can discover and book it.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Turf Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Turf name
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Mirpur Football Turf"
                required
                disabled={loading}
                className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Area / Location
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Mirpur, Dhaka"
                required
                disabled={loading}
                className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full address
            </label>

            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street, road, landmark"
              required
              disabled={loading}
              className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Turf image URL
            </label>

            <div className="relative">
              <Image
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/turf-image.jpg"
                required
                disabled={loading}
                className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
              />
            </div>

            <p className="mt-1.5 text-xs text-gray-400">
              For now, use an image URL. We can add image upload later.
            </p>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="pricePerHour"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Price per hour
            </label>

            <div className="relative">
              <DollarSign
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="pricePerHour"
                name="pricePerHour"
                type="number"
                min="0"
                value={formData.pricePerHour}
                onChange={handleChange}
                placeholder="1500"
                required
                disabled={loading}
                className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label
              htmlFor="capacity"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Player capacity
            </label>

            <div className="relative">
              <Users
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="10"
                required
                disabled={loading}
                className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Opening Time */}
          <div>
            <label
              htmlFor="openingTime"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Opening time
            </label>

            <div className="relative">
              <Clock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="openingTime"
                name="openingTime"
                type="time"
                value={formData.openingTime}
                onChange={handleChange}
                required
                disabled={loading}
                className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Closing Time */}
          <div>
            <label
              htmlFor="closingTime"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Closing time
            </label>

            <div className="relative">
              <Clock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="closingTime"
                name="closingTime"
                type="time"
                value={formData.closingTime}
                onChange={handleChange}
                required
                disabled={loading}
                className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Facilities */}
          <div className="md:col-span-2">
            <label
              htmlFor="facilities"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Facilities
            </label>

            <input
              id="facilities"
              name="facilities"
              type="text"
              value={formData.facilities}
              onChange={handleChange}
              placeholder="Parking, Flood Lights, Changing Room, Washroom"
              disabled={loading}
              className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Separate facilities with commas.
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3.5 top-3.5 text-gray-400"
              />

              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your turf, playing environment, facilities, etc."
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/owner-dashboard")}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Adding Turf...
              </>
            ) : (
              <>
                <Plus size={17} />
                Add Turf
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTurf;