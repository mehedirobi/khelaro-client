import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_URL = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : "";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  location: "",
  photoURL: "",
};

const SWAL_CONFIG = {
  confirmButtonColor: "#16a34a",
};

const Profile = () => {
  const { currentUser, loading: authLoading } = useAuth();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const userEmail = currentUser?.email?.trim().toLowerCase() || "";

  // Load profile
  useEffect(() => {
    if (authLoading) return;

    if (!userEmail) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/users/${encodeURIComponent(userEmail)}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load profile."
          );
        }

        const user = data?.user || {};

        setFormData({
          name: user.name || currentUser?.displayName || "",
          email: user.email || userEmail,
          phone: user.phone || "",
          location: user.location || "",
          photoURL:
            user.photoURL || currentUser?.photoURL || "",
        });
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Load profile error:", error);

        Swal.fire({
          ...SWAL_CONFIG,
          icon: "error",
          title: "Failed to load profile",
          text:
            error.message ||
            "Something went wrong while loading your profile.",
        });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => controller.abort();
  }, [
    authLoading,
    userEmail,
    currentUser?.displayName,
    currentUser?.photoURL,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Upload profile image
  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const resetInput = () => {
      event.target.value = "";
    };

    if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
      await Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "Cloudinary is not configured",
        text:
          "Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your frontend .env file.",
      });

      resetInput();
      return;
    }

    if (!file.type.startsWith("image/")) {
      await Swal.fire({
        ...SWAL_CONFIG,
        icon: "warning",
        title: "Invalid file",
        text: "Please select a valid image file.",
      });

      resetInput();
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      await Swal.fire({
        ...SWAL_CONFIG,
        icon: "warning",
        title: "Image too large",
        text: "Please select an image smaller than 5MB.",
      });

      resetInput();
      return;
    }

    try {
      setUploading(true);

      const uploadData = new FormData();

      uploadData.append("file", file);
      uploadData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error?.message || "Image upload failed."
        );
      }

      if (!data?.secure_url) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      setFormData((previous) => ({
        ...previous,
        photoURL: data.secure_url,
      }));

      await Swal.fire({
        ...SWAL_CONFIG,
        icon: "success",
        title: "Photo uploaded",
        text: "Click Save Changes to update your profile.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "Upload failed",
        text:
          error.message || "Could not upload your profile photo.",
      });
    } finally {
      setUploading(false);
      resetInput();
    }
  };

  const handleRemovePhoto = () => {
    setFormData((previous) => ({
      ...previous,
      photoURL: "",
    }));
  };

  // Save profile
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userEmail) {
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "warning",
        title: "Not logged in",
        text: "Please login first.",
      });

      return;
    }

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const location = formData.location.trim();

    if (!name) {
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "warning",
        title: "Name required",
        text: "Please enter your full name.",
      });

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/users/${encodeURIComponent(userEmail)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            location,
            photoURL: formData.photoURL,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update profile."
        );
      }

      const updatedUser = data?.user || {};

      const updatedFormData = {
        name: updatedUser.name || name,
        email: updatedUser.email || userEmail,
        phone: updatedUser.phone || phone,
        location: updatedUser.location || location,
        photoURL: updatedUser.photoURL || "",
      };

      setFormData(updatedFormData);

      localStorage.setItem(
        "khelaro-user",
        JSON.stringify(updatedUser)
      );

      await Swal.fire({
        ...SWAL_CONFIG,
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Update profile error:", error);

      Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "Update failed",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return <LoadingState message="Loading your profile..." />;
  }

  if (!currentUser) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <User size={24} className="text-gray-500" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Please login first
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            You need to be logged in to view your profile.
          </p>

          <Link
            to="/login"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return <LoadingState message="Loading your profile..." />;
  }

  const profileInitial =
    formData.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <main>
      {/* Header */}
      <header>
        <Link
          to="/turfs"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mt-5">
          <p className="text-sm font-medium text-green-600">
            Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Profile Settings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[280px_1fr]">
        {/* Profile Summary */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt={`${formData.name || "User"} profile`}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-green-50"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">
                  {profileInitial}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                aria-label="Upload profile photo"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-600 text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Camera size={16} />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageSelect}
                className="hidden"
                aria-label="Choose profile photo"
              />
            </div>

            {formData.photoURL && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={uploading}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-500 transition hover:text-red-600 disabled:opacity-50"
              >
                <X size={14} />
                Remove photo
              </button>
            )}

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

          <div className="space-y-4 text-sm">
            <ProfileInfo
              icon={Mail}
              value={formData.email}
            />

            <ProfileInfo
              icon={Phone}
              value={formData.phone || "No phone added"}
            />

            <ProfileInfo
              icon={MapPin}
              value={formData.location || "No location added"}
            />
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

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={User}
                required
                className="sm:col-span-2"
              />

              <div>
                <InputField
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  icon={Mail}
                  disabled
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  Email cannot be changed here.
                </p>
              </div>

              <InputField
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1XXXXXXXXX"
                icon={Phone}
              />

              <InputField
                id="location"
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Dhaka, Bangladesh"
                icon={MapPin}
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={saving || uploading}
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

const LoadingState = ({ message }) => {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

        <p className="mt-4 text-sm text-gray-500">
          {message}
        </p>
      </div>
    </main>
  );
};

const ProfileInfo = ({ icon: Icon, value }) => {
  return (
    <div className="flex min-w-0 items-center gap-3 text-gray-500">
      <Icon
        size={17}
        className="shrink-0 text-green-600"
      />

      <span className="truncate">{value}</span>
    </div>
  );
};

const InputField = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
  required = false,
  className = "",
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={
            id === "name"
              ? "name"
              : id === "email"
                ? "email"
                : id === "phone"
                  ? "tel"
                  : "street-address"
          }
          className={`h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 ${
            disabled
              ? "cursor-not-allowed bg-gray-50 text-gray-500"
              : "bg-white text-gray-900"
          }`}
        />
      </div>
    </div>
  );
};

export default Profile;