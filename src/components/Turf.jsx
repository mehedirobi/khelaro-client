import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Map,
  RotateCcw,
  MapPin,
  Trophy,
  Check,
} from "lucide-react";

import TurfCard from "../components/TurfCard";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const sports = ["All sports", "Football", "Cricket", "Badminton"];

const TurfSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="absolute left-4 top-4 h-7 w-20 animate-pulse rounded-full bg-white/70" />
        <div className="absolute right-4 top-4 h-10 w-10 animate-pulse rounded-full bg-white/70" />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="h-7 w-14 animate-pulse rounded-lg bg-gray-100" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
        </div>

        <div className="h-px bg-gray-100" />

        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

const Turf = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [turfs, setTurfs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [sport, setSport] = useState("All sports");
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /*
   * Load turfs from MongoDB backend.
   */
  useEffect(() => {
    const controller = new AbortController();

    const fetchTurfs = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_URL}/turfs`, {
          method: "GET",
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load turfs."
          );
        }

        const turfData = Array.isArray(data)
          ? data
          : Array.isArray(data?.turfs)
            ? data.turfs
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setTurfs(turfData);
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Turf fetch error:", error);
        setTurfs([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchTurfs();

    return () => {
      controller.abort();
    };
  }, []);

  /*
   * Create locations dynamically from MongoDB turf data.
   */
  const locations = useMemo(() => {
    const uniqueLocations = new Set();

    turfs.forEach((turf) => {
      const area = String(turf?.area || "").trim();
      const locationValue = String(
        turf?.location || ""
      ).trim();

      if (area) {
        uniqueLocations.add(area);
      } else if (locationValue) {
        const firstPart = locationValue
          .split(",")[0]
          .trim();

        if (firstPart) {
          uniqueLocations.add(firstPart);
        }
      }
    });

    return [
      "All locations",
      ...Array.from(uniqueLocations).sort((a, b) =>
        a.localeCompare(b)
      ),
    ];
  }, [turfs]);

  /*
   * Keep location filter synced with URL.
   */
  useEffect(() => {
    const urlLocation = searchParams.get("location");

    if (!urlLocation) {
      setLocation("All locations");
      return;
    }

    const matchedLocation = locations.find(
      (item) =>
        item.toLowerCase() ===
        urlLocation.toLowerCase()
    );

    setLocation(
      matchedLocation || "All locations"
    );
  }, [searchParams, locations]);

  /*
   * Count turfs for each location.
   */
  const locationCounts = useMemo(() => {
    const counts = {};

    locations.forEach((item) => {
      if (item === "All locations") {
        counts[item] = turfs.length;
        return;
      }

      const selectedLocation = item.toLowerCase();

      counts[item] = turfs.filter((turf) => {
        const area = String(
          turf?.area || ""
        ).toLowerCase();

        const turfLocation = String(
          turf?.location || ""
        ).toLowerCase();

        return (
          area === selectedLocation ||
          turfLocation.includes(selectedLocation)
        );
      }).length;
    });

    return counts;
  }, [locations, turfs]);

  /*
   * Filter and sort turfs.
   */
  const filteredTurfs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const selectedLocation =
      location.toLowerCase();
    const selectedSport = sport.toLowerCase();

    const result = turfs.filter((turf) => {
      const name = String(
        turf?.name || ""
      ).toLowerCase();

      const turfLocation = String(
        turf?.location || ""
      ).toLowerCase();

      const area = String(
        turf?.area || ""
      ).toLowerCase();

      const turfSport = String(
        turf?.sport || ""
      ).toLowerCase();

      const description = String(
        turf?.description || ""
      ).toLowerCase();

      const features = Array.isArray(
        turf?.features
      )
        ? turf.features
            .join(" ")
            .toLowerCase()
        : "";

      const amenities = Array.isArray(
        turf?.amenities
      )
        ? turf.amenities
            .join(" ")
            .toLowerCase()
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
        area === selectedLocation ||
        turfLocation.includes(selectedLocation);

      const matchesSport =
        sport === "All sports" ||
        turfSport === selectedSport;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSport
      );
    });

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a?.price || 0) -
          Number(b?.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b?.price || 0) -
          Number(a?.price || 0)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b?.rating || 0) -
          Number(a?.rating || 0)
      );
    }

    return result;
  }, [
    turfs,
    search,
    location,
    sport,
    sort,
  ]);

  const hasActiveFilters =
    Boolean(search.trim()) ||
    location !== "All locations" ||
    sport !== "All sports";

  const handleLocationChange = (value) => {
    setLocation(value);
    setShowFilters(false);

    const nextParams = new URLSearchParams(
      searchParams
    );

    if (value === "All locations") {
      nextParams.delete("location");
    } else {
      nextParams.set(
        "location",
        value.toLowerCase()
      );
    }

    setSearchParams(nextParams);
  };

  const handleSportChange = (value) => {
    setSport(value);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("All locations");
    setSport("All sports");
    setSort("recommended");

    const nextParams = new URLSearchParams(
      searchParams
    );

    nextParams.delete("location");

    setSearchParams(nextParams);
  };

  const removeSearch = () => {
    setSearch("");
  };

  const removeLocation = () => {
    handleLocationChange("All locations");
  };

  const removeSport = () => {
    setSport("All sports");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-green-500/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-green-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              <MapPin size={14} />
              Explore Dhaka
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
              Find the perfect{" "}
              <span className="text-green-600">
                turf
              </span>{" "}
              for your game
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Discover sports turfs across Dhaka,
              compare your options, and find a
              convenient place for your next game.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-4xl">
            <div className="group relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-green-600"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by turf name, location or sport..."
                aria-label="Search turfs"
                className="h-13 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 shadow-sm outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={removeSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:text-gray-700 active:scale-95"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Mobile filters */}
            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (previous) => !previous
                )
              }
              aria-expanded={showFilters}
              aria-controls="turf-filters"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-green-200 hover:bg-green-50 hover:text-green-700 active:scale-[0.98] lg:hidden"
            >
              <SlidersHorizontal
                size={17}
                className={`transition-transform duration-300 ${
                  showFilters
                    ? "rotate-90"
                    : ""
                }`}
              />

              {showFilters
                ? "Hide filters"
                : "Show filters"}

              {hasActiveFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1.5 text-[10px] font-bold text-white">
                  !
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside
            id="turf-filters"
            className={`overflow-hidden transition-all duration-300 ease-out ${
              showFilters
                ? "max-h-[900px] opacity-100"
                : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
            }`}
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Filters
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Refine your search
                  </p>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-green-600 transition-all duration-200 hover:bg-green-50 hover:text-green-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Location */}
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={15}
                      className="text-green-600"
                    />

                    <span className="text-sm font-semibold text-gray-900">
                      Location
                    </span>
                  </div>

                  {location !==
                    "All locations" && (
                    <span className="text-[11px] font-medium text-gray-400">
                      {locationCounts[
                        location
                      ] || 0}{" "}
                      found
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {locations.map((item) => {
                    const isActive =
                      location === item;

                    const count =
                      locationCounts[item] || 0;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          handleLocationChange(
                            item
                          )
                        }
                        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-green-50 font-semibold text-green-700"
                            : "text-gray-500 hover:translate-x-0.5 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-green-600" />
                        )}

                        <span className="flex items-center gap-2">
                          {isActive && (
                            <Check
                              size={14}
                              className="text-green-600"
                            />
                          )}

                          <span>{item}</span>
                        </span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all duration-200 ${
                            isActive
                              ? "bg-white text-green-700 shadow-sm"
                              : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-gray-500"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sport */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Trophy
                    size={15}
                    className="text-green-600"
                  />

                  <span className="text-sm font-semibold text-gray-900">
                    Sport
                  </span>
                </div>

                <div className="space-y-1">
                  {sports.map((item) => {
                    const isActive =
                      sport === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          handleSportChange(
                            item
                          )
                        }
                        className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-green-50 font-semibold text-green-700"
                            : "text-gray-500 hover:translate-x-0.5 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isActive && (
                            <Check
                              size={14}
                              className="text-green-600"
                            />
                          )}

                          {item}
                        </span>

                        <span
                          className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                            isActive
                              ? "scale-100 bg-green-600"
                              : "scale-0 bg-gray-300 group-hover:scale-100"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0">
            {/* Toolbar */}
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {filteredTurfs.length}
                  </span>{" "}
                  {filteredTurfs.length === 1
                    ? "turf"
                    : "turfs"}
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
                    onChange={(event) =>
                      setSort(
                        event.target.value
                      )
                    }
                    className="h-10 appearance-none rounded-xl border border-gray-200 bg-white pl-3 pr-9 text-sm font-medium text-gray-700 outline-none transition-all duration-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
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
                  className="hidden h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:text-green-700 sm:inline-flex"
                >
                  <Map size={16} />
                  Map
                </Link>
              </div>
            </div>

            {/* Active filters */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {search.trim() && (
                  <button
                    type="button"
                    onClick={removeSearch}
                    className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition-all duration-200 hover:border-green-200 hover:bg-green-100 active:scale-95"
                  >
                    <Search size={12} />

                    <span className="max-w-[180px] truncate">
                      {search}
                    </span>

                    <X
                      size={13}
                      className="shrink-0"
                    />
                  </button>
                )}

                {location !==
                  "All locations" && (
                  <button
                    type="button"
                    onClick={removeLocation}
                    className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition-all duration-200 hover:border-green-200 hover:bg-green-100 active:scale-95"
                  >
                    <MapPin size={12} />
                    {location}
                    <X size={13} />
                  </button>
                )}

                {sport !== "All sports" && (
                  <button
                    type="button"
                    onClick={removeSport}
                    className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition-all duration-200 hover:border-green-200 hover:bg-green-100 active:scale-95"
                  >
                    <Trophy size={12} />
                    {sport}
                    <X size={13} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              </div>
            )}

            {/* Results */}
            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:gap-6">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <TurfSkeleton
                    key={index}
                  />
                ))}
              </div>
            ) : filteredTurfs.length > 0 ? (
              <div
                key={`${location}-${sport}-${search}-${sort}`}
                className="grid gap-5 sm:grid-cols-2 xl:gap-6"
              >
                {filteredTurfs.map(
                  (turf, index) => (
                    <div
                      key={
                        turf?._id ||
                        turf?.id ||
                        turf?.slug ||
                        index
                      }
                      className="animate-[turfIn_0.45s_cubic-bezier(0.22,1,0.36,1)_both]"
                      style={{
                        animationDelay: `${Math.min(
                          index * 70,
                          420
                        )}ms`,
                      }}
                    >
                      <TurfCard turf={turf} />
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="animate-[fadeIn_0.35s_ease-out] rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 animate-[emptyPop_0.4s_ease-out] items-center justify-center rounded-2xl bg-gray-100">
                  <Search
                    size={26}
                    className="text-gray-400"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  No turfs found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  We couldn't find any turfs
                  matching your current search
                  and filters.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 active:scale-95"
                  >
                    <RotateCcw size={15} />
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Animation helpers */}
      <style>{`
        @keyframes turfIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes filterIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes emptyPop {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
};

export default Turf;