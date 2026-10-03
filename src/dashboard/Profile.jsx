import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_URL = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : "";

const Profile = () => {
  const { currentUser, loading: authLoading } = useAuth();

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    photoURL: "",
  });

  // =========================
  // Load Profile
  // =========================

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
          `${API_URL}/users/${encodeURIComponent(
            currentUser.email
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        const user = data.user;

        setFormData({
          name:
            user.name ||
            currentUser.displayName ||
            "",

          email:
            user.email ||
            currentUser.email ||
            "",

          phone: user.phone || "",

          location: user.location || "",

          photoURL:
            user.photoURL ||
            currentUser.photoURL ||
            "",
        });
      } catch (error) {
        console.error("Load profile error:", error);

        Swal.fire({
          icon: "error",
          title: "Failed to load profile",
          text:
            error.message ||
            "Something went wrong while loading your profile.",
          confirmButtonColor: "#16a34a",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, authLoading]);

  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // Upload Profile Image
  // =========================

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check Cloudinary configuration
    if (!CLOUDINARY_CLOUD_NAME || !UPLOAD_PRESET) {
      Swal.fire({
        icon: "error",
        title: "Cloudinary is not configured",
        text:
          "Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to the frontend .env file.",
        confirmButtonColor: "#16a34a",
      });

      e.target.value = "";
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "Invalid file",
        text: "Please select an image file.",
        confirmButtonColor: "#16a34a",
      });

      e.target.value = "";
      return;
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Image too large",
        text: "Please select an image smaller than 5MB.",
        confirmButtonColor: "#16a34a",
      });

      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const uploadData = new FormData();

      uploadData.append("file", file);
      uploadData.append(
        "upload_preset",
        UPLOAD_PRESET
      );

      const response = await fetch(
        CLOUDINARY_URL,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            "Image upload failed."
        );
      }

      // Save Cloudinary URL in React state
      setFormData((previous) => ({
        ...previous,
        photoURL: data.secure_url,
      }));

      Swal.fire({
        icon: "success",
        title: "Photo uploaded",
        text: "Click Save Changes to save your profile photo.",
        confirmButtonColor: "#16a34a",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "Cloudinary upload error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text:
          error.message ||
          "Could not upload your photo.",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setUploading(false);

      // Allow selecting same file again
      e.target.value = "";
    }
  };

  // =========================
  // Remove Photo
  // =========================

  const handleRemovePhoto = () => {
    setFormData((previous) => ({
      ...previous,
      photoURL: "",
    }));
  };

  // =========================
  // Save Profile
  // =========================

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
        `${API_URL}/users/${encodeURIComponent(
          currentUser.email
        )}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            location: formData.location.trim(),
            photoURL: formData.photoURL,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile."
        );
      }

      const updatedUser = data.user;

      // Update UI with latest data
      setFormData({
        name: updatedUser.name || "",

        email:
          updatedUser.email ||
          currentUser.email ||
          "",

        phone: updatedUser.phone || "",

        location:
          updatedUser.location || "",

        photoURL:
          updatedUser.photoURL || "",
      });

      // Keep local user data updated
      localStorage.setItem(
        "khelaro-user",
        JSON.stringify(updatedUser)
      );

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text:
          "Your profile has been updated successfully.",
        confirmButtonColor: "#16a34a",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error.message ||
          "Something went wrong.",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Auth Loading
  // =========================

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

  // =========================
  // Not Logged In
  // =========================

  if (!currentUser) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Please login first
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            You need to be logged in to view your
            profile.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // Profile Loading
  // =========================

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

  // =========================
  // Profile Initial
  // =========================

  const profileInitial =
    formData.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "U";

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
          Manage your personal information and
          account details.
        </p>
      </div>

      {/* Content */}

      <div className="mt-8 grid gap-6 xl:grid-cols-[280px_1fr]">
        {/* Profile Card */}

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col items-center text-center">
            {/* Profile Image */}

            <div className="relative">
              {formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt={
                    formData.name ||
                    "Profile"
                  }
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-green-50"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">
                  {profileInitial}
                </div>
              )}

              {/* Camera Button */}

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploading}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-600 text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Upload profile photo"
              >
                {uploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Camera size={16} />
                )}
              </button>

              {/* File Input */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Remove Photo */}

            {formData.photoURL && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-500 transition hover:text-red-600"
              >
                <X size={14} />

                Remove photo
              </button>
            )}

            {/* Name */}

            <h2 className="mt-4 font-bold text-gray-900">
              {formData.name || "User"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Turf Player
            </p>

            <p className="mt-3 text-xs text-gray-400">
              JPG, PNG or WebP · Max 5MB
            </p>
          </div>

          <div className="my-6 h-px bg-gray-100" />

          {/* User Information */}

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
                {formData.phone ||
                  "No phone added"}
              </span>
            </div>

            {/* Location */}

            <div className="flex items-center gap-3 text-gray-500">
              <MapPin
                size={17}
                className="shrink-0 text-green-600"
              />

              <span>
                {formData.location ||
                  "No location added"}
              </span>
            </div>
          </div>
        </aside>

        {/* Personal Information */}

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
                disabled={
                  saving || uploading
                }
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