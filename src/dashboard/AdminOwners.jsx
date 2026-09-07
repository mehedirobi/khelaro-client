import { useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  UserCheck,
} from "lucide-react";

const AdminOwners = () => {
  const [search, setSearch] = useState("");

  const owners = [
    {
      id: 1,
      name: "Arif Hossain",
      email: "arif@example.com",
      turfs: 3,
      joined: "10 Aug 2026",
      status: "Verified",
    },
    {
      id: 2,
      name: "Tanvir Ahmed",
      email: "tanvir@example.com",
      turfs: 2,
      joined: "08 Aug 2026",
      status: "Pending",
    },
    {
      id: 3,
      name: "Fahim Rahman",
      email: "fahim@example.com",
      turfs: 4,
      joined: "04 Aug 2026",
      status: "Verified",
    },
    {
      id: 4,
      name: "Sakib Khan",
      email: "sakib@example.com",
      turfs: 1,
      joined: "01 Aug 2026",
      status: "Pending",
    },
  ];

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(search.toLowerCase()) ||
      owner.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Owners
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage and verify turf owners.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-sm">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
          />

        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <UserCheck size={17} />
          {filteredOwners.length} owners
        </div>

      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-left">

            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold">Owner</th>
                <th className="px-5 py-4 font-semibold">Turfs</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredOwners.map((owner) => (
                <tr
                  key={owner.id}
                  className="hover:bg-gray-50"
                >

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {owner.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {owner.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {owner.email}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                    {owner.turfs}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500">
                    {owner.joined}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        owner.status === "Verified"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {owner.status}
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

                      {owner.status === "Pending" ? (
                        <>
                          <button
                            title="Approve"
                            className="rounded-lg p-2 text-green-500 hover:bg-green-50"
                          >
                            <CheckCircle2 size={17} />
                          </button>

                          <button
                            title="Reject"
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <XCircle size={17} />
                          </button>
                        </>
                      ) : (
                        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                          <MoreHorizontal size={17} />
                        </button>
                      )}

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

export default AdminOwners;