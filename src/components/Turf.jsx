import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { turfs } from "../data/turfs";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Heart,
  ArrowUpRight,
  Map,
} from "lucide-react";

const locations = [
  "All locations",
  "Mirpur",
  "Uttara",
  "Mohammadpur",
  "Dhanmondi",
  "Badda",
  "Bashundhara",
];

const sports = ["All sports", "Football", "Cricket", "Badminton"];

const Turfs = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [sport, setSport] = useState("All sports");
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTurfs = useMemo(() => {
    let result = [...turfs];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter(
        (turf) =>
          turf.name.toLowerCase().includes(query) ||
          turf.location.toLowerCase().includes(query) ||
          turf.area.toLowerCase().includes(query) ||
          turf.sport.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (location !== "All locations") {
      result = result.filter(
        (turf) =>
          turf.area.toLowerCase() === location.toLowerCase()
      );
    }

    // Sport filter
    if (sport !== "All sports") {
      result = result.filter((turf) => turf.sport === sport);
    }

    // Sorting
    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, location, sport, sort]);

  const clearFilters = () => {
    setSearch("");
    setLocation("All locations");
    setSport("All sports");
    setSort("recommended");
  };

  const hasActiveFilters =
    search.trim() ||
    location !== "All locations" ||
    sport !== "All sports";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Explore turfs
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Find the perfect turf
            </h1>

            <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
              Discover sports turfs across Dhaka and find a place
              that works for your next game.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by turf name, location or sport..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:border-gray-300 lg:hidden"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Filters
                </h2>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-medium text-green-600 transition hover:text-green-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Location */}
              <div className="mt-6">
                <label className="mb-3 block text-sm font-medium text-gray-900">
                  Location
                </label>

                <div className="space-y-2">
                  {locations.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLocation(item)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                        location === item
                          ? "bg-green-50 font-medium text-green-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item}

                      {location === item && (
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sport */}
              <div className="mt-7 border-t border-gray-100 pt-6">
                <label className="mb-3 block text-sm font-medium text-gray-900">
                  Sport
                </label>

                <div className="space-y-2">
                  {sports.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSport(item)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                        sport === item
                          ? "bg-green-50 font-medium text-green-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item}

                      {sport === item && (
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            {/* Result Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">
                    {filteredTurfs.length}
                  </span>{" "}
                  turfs found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="hidden text-sm text-gray-500 sm:block"
                >
                  Sort by
                </label>

                <div className="relative">
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-10 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-700 outline-none transition focus:border-green-500"
                  >
                    <option value="recommended">
                      Recommended
                    </option>

                    <option value="rating">
                      Highest rated
                    </option>

                    <option value="price-low">
                      Price: Low to high
                    </option>

                    <option value="price-high">
                      Price: High to low
                    </option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                <Link
                  to="/turfs/map"
                  className="hidden h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 sm:inline-flex"
                >
                  <Map size={16} />
                  Map
                </Link>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700"
                  >
                    Search: {search}
                    <X size={13} />
                  </button>
                )}

                {location !== "All locations" && (
                  <button
                    type="button"
                    onClick={() =>
                      setLocation("All locations")
                    }
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700"
                  >
                    {location}
                    <X size={13} />
                  </button>
                )}

                {sport !== "All sports" && (
                  <button
                    type="button"
                    onClick={() => setSport("All sports")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700"
                  >
                    {sport}
                    <X size={13} />
                  </button>
                )}
              </div>
            )}

            {/* Turf Cards */}
            {filteredTurfs.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredTurfs.map((turf) => (
                  <article
                    key={turf.id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-100"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={turf.image}
                        alt={turf.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
                          {turf.sport}
                        </span>

                        <button
                          type="button"
                          aria-label={`Add ${turf.name} to favorites`}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm transition hover:text-red-500"
                        >
                          <Heart size={17} />
                        </button>
                      </div>

                      {/* Availability */}
                      <div className="absolute bottom-4 left-4">
                        <span className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                          Available
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-gray-900">
                            {turf.name}
                          </h3>

                          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin
                              size={14}
                              className="shrink-0"
                            />

                            <span>{turf.location}</span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                          <Star
                            size={13}
                            fill="currentColor"
                          />

                          {turf.rating}
                        </div>
                      </div>

                      {/* Turf Info */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-500">
                          {turf.size}
                        </span>

                        <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-500">
                          {turf.surface}
                        </span>

                        <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-500">
                          Floodlights
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="my-4 border-t border-gray-100" />

                      {/* Bottom */}
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            Starting from
                          </p>

                          <p className="mt-1 text-lg font-bold text-gray-900">
                            ৳{turf.price.toLocaleString()}
                            <span className="ml-1 text-xs font-normal text-gray-400">
                              / hour
                            </span>
                          </p>
                        </div>

                        <Link
                          to={`/turfs/${turf.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-green-600"
                        >
                          View details

                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <Search
                    size={24}
                    className="text-gray-400"
                  />
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  No turfs found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Try changing your search or removing some
                  filters to find more turfs.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Turfs;