import { useContext, useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

import { AuthContext } from "../contexts/AuthProvider";

const OwnerProfile = () => {
  const { currentUser } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/users/${encodeURIComponent(
            currentUser.email
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        setProfile({
          name:
            data.name ||
            currentUser.displayName ||
            "",
          email: data.email || currentUser.email,
          phone: data.phone || "",
          role: data.role || "owner",
        });
      } catch (error) {
        console.error("Profile error:", error);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:3000/users/${encodeURIComponent(
          profile.email
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            phone: profile.phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      setProfile((prev) => ({
        ...prev,
        ...data.user,
      }));

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
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
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your owner account information.
        </p>
      </div>

      {/* Profile Header */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-green-100 text-xl font-bold text-green-700">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={profile.name || "Owner"}
                className="h-full w-full object-cover"
              />
            ) : (
              profile.name?.charAt(0)?.toUpperCase() ||
              "O"
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {profile.name || "Turf Owner"}
            </h2>

            <p className="text-sm text-gray-500">
              {profile.email}
            </p>

            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
              <ShieldCheck size={13} />
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="h-12 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-500"
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+880..."
                className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerProfile;