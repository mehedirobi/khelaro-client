import { useState } from "react";
import {
  Search,
  MapPinned,
  Eye,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";

const AdminTurfs = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const turfs = [
    {
      id: 1,
      name: "Mirpur Football Turf",
      owner: "Arif Hossain",
      location: "Mirpur, Dhaka",
      price: "৳1,500/hr",
      status: "Approved",
    },
    {
      id: 2,
      name: "Uttara Sports Arena",
      owner: "Tanvir Ahmed",
      location: "Uttara, Dhaka",
      price: "৳1,800/hr",
      status: "Pending",
    },
    {
      id: 3,
      name: "Dhanmondi Turf Zone",
      owner: "Fahim Rahman",
      location: "Dhanmondi, Dhaka",
      price: "৳1,200/hr",
      status: "Approved",
    },
    {
      id: 4,
      name: "Banani Sports Club",
      owner: "Sakib Khan",
      location: "Banani, Dhaka",
      price: "৳2,000/hr",
      status: "Rejected",
    },
  ];

  const filteredTurfs = turfs.filter((turf) => {
    const matchesSearch =
      turf.name.toLowerCase().includes(search.toLowerCase()) ||
      turf.owner.toLowerCase().includes(search.toLowerCase()) ||
      turf.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || turf.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Turfs
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review and manage all turfs listed on Khelaro.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full lg:max-w-sm">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search turfs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
          />

        </div>

        <div className="flex flex-wrap gap-2">

          {["All", "Pending", "Approved", "Rejected"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  filter === item
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            )
          )}

        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-left">

            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold">Turf</th>
                <th className="px-5 py-4 font-semibold">Owner</th>
                <th className="px-5 py-4 font-semibold">Location</th>
                <th className="px-5 py-4 font-semibold">Price</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredTurfs.map((turf) => (
                <tr
                  key={turf.id}
                  className="hover:bg-gray-50"
                >

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <MapPinned size={18} />
                      </div>

                      <p className="text-sm font-semibold text-gray-900">
                        {turf.name}
                      </p>

                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {turf.owner}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500">
                    {turf.location}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                    {turf.price}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        turf.status === "Approved"
                          ? "bg-green-50 text-green-600"
                          : turf.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {turf.status}
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

                      {turf.status === "Pending" && (
                        <>
                          <button
                            title="Approve"
                            className="rounded-lg p-2 text-green-500 hover:bg-green-50"
                          >
                            <Check size={17} />
                          </button>

                          <button
                            title="Reject"
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <X size={17} />
                          </button>
                        </>
                      )}

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

        {filteredTurfs.length === 0 && (
          <div className="py-16 text-center">
            <MapPinned
              size={30}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-medium text-gray-500">
              No turfs found
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminTurfs;