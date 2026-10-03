import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const API_URL = "http://localhost:3000";

const Profile = () => {
  const { currentUser, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    photoURL: "",
  });

  // Load profile from MongoDB
  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return;

      if (!currentUser?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/users/${encodeURIComponent(currentUser.email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        const user = data.user;

        setFormData({
          name: user.name || currentUser.displayName || "",
          email: user.email || currentUser.email || "",
          phone: user.phone || "",
          location: user.location || "",
          photoURL: user.photoURL || currentUser.photoURL || "",
        });
      } catch (error) {
        console.error("Load profile error:", error);

        Swal.fire({
          icon: "error",
          title: "Failed to load profile",
          text: error.message || "Something went wrong.",
          confirmButtonColor: "#16a34a",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.email) {
      Swal.fire({
        icon: "warning",
        title: "Not logged in",
        text: "Please login first.",
        confirmButtonColor: "#16a34a",
      });

      return;
    }

    if (!formData.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name required",
        text: "Please enter your full name.",
        confirmButtonColor: "#16a34a",
      });

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/users/${encodeURIComponent(currentUser.email)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            location: formData.location,
            photoURL: formData.photoURL,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = data.user;

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || currentUser.email || "",
        phone: updatedUser.phone || "",
        location: updatedUser.location || "",
        photoURL: updatedUser.photoURL || "",
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#16a34a",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Update profile error:", error);

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: error.message || "Something went wrong.",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setSaving(false);
    }
  };

  // Auth loading
  if (authLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  // Not logged in
  if (!currentUser) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Please login first
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            You need to be logged in to view your profile.
          </p>
        </div>
      </main>
    );
  }

  // MongoDB profile loading
  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  const profileInitial =
    formData.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <main>
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-green-600">
          Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          Profile Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[280px_1fr]">
        {/* Profile Card */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt={formData.name || "Profile"}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-green-50"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">
                  {profileInitial}
                </div>
              )}

              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-600 text-white shadow-sm transition hover:bg-green-700"
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="mt-4 font-bold text-gray-900">
              {formData.name || "User"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Turf Player
            </p>
          </div>

          <div className="my-6 h-px bg-gray-100" />

          <div className="space-y-4 text-sm">
            {/* Email */}
            <div className="flex items-center gap-3 text-gray-500">
              <Mail
                size={17}
                className="shrink-0 text-green-600"
              />

              <span className="truncate">
                {formData.email}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 text-gray-500">
              <Phone
                size={17}
                className="shrink-0 text-green-600"
              />

              <span>
                {formData.phone || "No phone added"}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 text-gray-500">
              <MapPin
                size={17}
                className="shrink-0 text-green-600"
              />

              <span>
                {formData.location || "No location added"}
              </span>
            </div>
          </div>
        </aside>

        {/* Form */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your personal details below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="h-12 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-500 outline-none"
                  />
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Email cannot be changed here.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXXXXXXXX"
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Dhaka, Bangladesh"
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Profile;