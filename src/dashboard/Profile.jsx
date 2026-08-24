import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
} from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "Mehedi",
    email: "mehedi@example.com",
    phone: "+880 1700-000000",
    location: "Dhaka, Bangladesh",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Profile updated:", formData);
  };

  return (
    <main>
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
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">
                M
              </div>

              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-600 text-white shadow-sm"
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="mt-4 font-bold text-gray-900">
              {formData.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Turf Player
            </p>
          </div>

          <div className="my-6 h-px bg-gray-100" />

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-gray-500">
              <Mail size={17} className="text-green-600" />
              <span className="truncate">
                {formData.email}
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-500">
              <Phone size={17} className="text-green-600" />
              <span>{formData.phone}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-500">
              <MapPin size={17} className="text-green-600" />
              <span>{formData.location}</span>
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
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Profile;