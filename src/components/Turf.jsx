import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Map,
} from "lucide-react";

import TurfCard from "../components/TurfCard";
import { turfs as turfData } from "../data/turfs";

const locations = [
  "All locations",
  "Mirpur",
  "Uttara",
  "Mohammadpur",
  "Dhanmondi",
  "Badda",
  "Bashundhara",
  "Banani",
];

const sports = ["All sports", "Football", "Cricket", "Badminton"];

const Turfs = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [sport, setSport] = useState("All sports");
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTurfs = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = turfData.filter((turf) => {
      const name = String(turf.name || "").toLowerCase();
      const turfLocation = String(turf.location || "").toLowerCase();
      const area = String(turf.area || "").toLowerCase();
      const turfSport = String(turf.sport || "").toLowerCase();
      const description = String(turf.description || "").toLowerCase();

      const features = Array.isArray(turf.features)
        ? turf.features.join(" ").toLowerCase()
        : "";

      const amenities = Array.isArray(turf.amenities)
        ? turf.amenities.join(" ").toLowerCase()
        : "";

      const matchesSearch =
        !query ||
        name.includes(query) ||
        turfLocation.includes(query) ||
        area.includes(query) ||
        turfSport.includes(query) ||
        description.includes(query) ||
        features.includes(query) ||
        amenities.includes(query);

      const matchesLocation =
        location === "All locations" ||
        area === location.toLowerCase();

      const matchesSport =
        sport === "All sports" ||
        turfSport === sport.toLowerCase();

      return matchesSearch && matchesLocation && matchesSport;
    });

    const sortedTurfs = [...result];

    if (sort === "price-low") {
      sortedTurfs.sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      sortedTurfs.sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    }

    if (sort === "rating") {
      sortedTurfs.sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    return sortedTurfs;
  }, [search, location, sport, sort]);

  const clearFilters = () => {
    setSearch("");
    setLocation("All locations");
    setSport("All sports");
    setSort("recommended");
  };

  const handleLocationChange = (value) => {
    setLocation(value);
    setShowFilters(false);
  };

  const handleSportChange = (value) => {
    setSport(value);
    setShowFilters(false);
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    location !== "All locations" ||
    sport !== "All sports";

  return (
    <main className="min-h-screen bg-gray-50">
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
              Discover sports turfs across Dhaka and find a place that works
              for your next game.
            </p>
          </div>

          <div className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by turf name, location or sport..."
                aria-label="Search turfs"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((previous) => !previous)}
              aria-expanded={showFilters}
              aria-controls="turf-filters"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:border-gray-300 lg:hidden"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside
            id="turf-filters"
            className={`${showFilters ? "block" : "hidden"} lg:block`}
          >
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Filters</h2>

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

              <div className="mt-6">
                <label className="mb-3 block text-sm font-medium text-gray-900">
                  Location
                </label>

                <div className="space-y-2">
                  {locations.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleLocationChange(item)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                        location === item
                          ? "bg-green-50 font-medium text-green-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span>{item}</span>

                      {location === item && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-green-600"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 border-t border-gray-100 pt-6">
                <label className="mb-3 block text-sm font-medium text-gray-900">
                  Sport
                </label>

                <div className="space-y-2">
                  {sports.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSportChange(item)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                        sport === item
                          ? "bg-green-50 font-medium text-green-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span>{item}</span>

                      {sport === item && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-green-600"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">
                  {filteredTurfs.length}
                </span>{" "}
                {filteredTurfs.length === 1 ? "turf" : "turfs"} found
              </p>

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
                    onChange={(event) => setSort(event.target.value)}
                    className="h-10 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest rated</option>
                    <option value="price-low">Price: Low to high</option>
                    <option value="price-high">Price: High to low</option>
                  </select>

                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                <Link
                  to="/turfs/map"
                  className="hidden h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900 sm:inline-flex"
                >
                  <Map size={16} />
                  Map
                </Link>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {search.trim() && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                  >
                    <span>Search: {search}</span>
                    <X size={13} />
                  </button>
                )}

                {location !== "All locations" && (
                  <button
                    type="button"
                    onClick={() => setLocation("All locations")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                  >
                    <span>{location}</span>
                    <X size={13} />
                  </button>
                )}

                {sport !== "All sports" && (
                  <button
                    type="button"
                    onClick={() => setSport("All sports")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                  >
                    <span>{sport}</span>
                    <X size={13} />
                  </button>
                )}
              </div>
            )}

            {filteredTurfs.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredTurfs.map((turf) => (
                  <TurfCard key={turf.id} turf={turf} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <Search
                    size={24}
                    aria-hidden="true"
                    className="text-gray-400"
                  />
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  No turfs found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Try changing your search or removing some filters to find
                  more turfs.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Turfs;