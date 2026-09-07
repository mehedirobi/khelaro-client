import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  UserRound,
  UserX,
  Eye,
} from "lucide-react";

const AdminUsers = () => {
  const [search, setSearch] = useState("");

  const users = [
    {
      id: 1,
      name: "Mehedi Hasan",
      email: "mehedi@example.com",
      joined: "12 Aug 2026",
      bookings: 12,
      status: "Active",
    },
    {
      id: 2,
      name: "Rakib Ahmed",
      email: "rakib@example.com",
      joined: "10 Aug 2026",
      bookings: 8,
      status: "Active",
    },
    {
      id: 3,
      name: "Siam Rahman",
      email: "siam@example.com",
      joined: "05 Aug 2026",
      bookings: 5,
      status: "Active",
    },
    {
      id: 4,
      name: "Nafis Islam",
      email: "nafis@example.com",
      joined: "02 Aug 2026",
      bookings: 3,
      status: "Blocked",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Users
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage all customers registered on Khelaro.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-sm">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
          />

        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <UserRound size={17} />
          {filteredUsers.length} users
        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px] text-left">

            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold">User</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
                <th className="px-5 py-4 font-semibold">Bookings</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50"
                >

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500">
                    {user.joined}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                    {user.bookings}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-1">

                      <button
                        title="View"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Block"
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <UserX size={17} />
                      </button>

                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                        <MoreHorizontal size={17} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AdminUsers;