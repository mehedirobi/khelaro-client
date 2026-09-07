import { useContext } from "react";
import {
  Mail,
  ShieldCheck,
  UserCircle,
  CalendarDays,
} from "lucide-react";

import { AuthContext } from "../contexts/AuthProvider";

const AdminProfile = () => {
  const { currentUser } = useContext(AuthContext);

  const savedUser = localStorage.getItem("khelaro-user");

  let userData = null;

  try {
    userData = savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const name =
    currentUser?.displayName ||
    userData?.name ||
    currentUser?.email?.split("@")[0] ||
    "Admin";

  const email =
    currentUser?.email ||
    userData?.email ||
    "";

  const photo =
    currentUser?.photoURL ||
    userData?.photoURL ||
    userData?.photo ||
    "";

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your administrator account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="bg-gray-950 px-6 py-8 sm:px-8">

          <div className="flex flex-col items-center gap-4 sm:flex-row">

            {photo ? (
              <img
                src={photo}
                alt={name}
                className="h-20 w-20 rounded-full border-4 border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                {initial}
              </div>
            )}

            <div className="text-center sm:text-left">

              <h2 className="text-xl font-bold text-white">
                {name}
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {email}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                <ShieldCheck size={14} />
                Administrator
              </div>

            </div>

          </div>

        </div>

        {/* Details */}
        <div className="p-6 sm:p-8">

          <h3 className="font-semibold text-gray-900">
            Account Information
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500">
                  <UserCircle size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Full Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {name}
                  </p>
                </div>

              </div>

            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500">
                  <Mail size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-gray-900">
                    {email}
                  </p>
                </div>

              </div>

            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Account Role
                  </p>

                  <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                    {userData?.role || "admin"}
                  </p>
                </div>

              </div>

            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Account Status
                  </p>

                  <p className="mt-1 text-sm font-medium text-green-600">
                    Active
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminProfile;