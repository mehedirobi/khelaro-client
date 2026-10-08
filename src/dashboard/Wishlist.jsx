import { useEffect, useState } from "react";
import {
  Heart,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/800x600?text=No+Turf+Image";

const Wishlist = () => {
  const { currentUser } = useAuth();

  const [wishlistTurfs, setWishlistTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const [error, setError] = useState("");

  const userEmail = currentUser?.email
    ? String(currentUser.email).trim().toLowerCase()
    : "";

  useEffect(() => {
    const controller = new AbortController();

    const fetchWishlist = async () => {
      if (!userEmail) {
        setWishlistTurfs([]);
        setLoading(false);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const encodedEmail = encodeURIComponent(userEmail);

        const response = await fetch(
          `${API_URL}/wishlist/${encodedEmail}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Failed to fetch wishlist (${response.status})`
          );
        }

        const wishlistItems = Array.isArray(data)
          ? data
          : Array.isArray(data?.wishlist)
            ? data.wishlist
            : Array.isArray(data?.data)
              ? data.data
              : [];

        const normalizedItems = wishlistItems
          .map((item) => {
            const turfId = String(
              item?.turfId ||
                item?.turf?._id ||
                item?.turf?.id ||
                item?._id ||
                item?.id ||
                ""
            ).trim();

            if (!turfId) return null;

            const turfData =
              item?.turf &&
              typeof item.turf === "object"
                ? item.turf
                : item;

            return {
              wishlistId: String(
                item?._id || item?.wishlistId || ""
              ).trim(),

              turfId,

              name: turfData?.name || "",
              image: turfData?.image || "",
              location:
                turfData?.location ||
                turfData?.area ||
                "",
              area: turfData?.area || "",
              sport: turfData?.sport || "",
              surface: turfData?.surface || "",
              size: turfData?.size || "",
              price: turfData?.price ?? 0,
              rating: turfData?.rating ?? null,
              reviews: turfData?.reviews ?? 0,

              facilities: Array.isArray(
                turfData?.facilities
              )
                ? turfData.facilities
                : Array.isArray(turfData?.amenities)
                  ? turfData.amenities
                  : Array.isArray(turfData?.features)
                    ? turfData.features
                    : [],
            };
          })
          .filter(Boolean);

        const incompleteItems = normalizedItems.filter(
          (item) => !item.name && item.turfId
        );

        if (incompleteItems.length > 0) {
          const resolvedItems = await Promise.all(
            normalizedItems.map(async (item) => {
              if (item.name) return item;

              try {
                const turfResponse = await fetch(
                  `${API_URL}/turfs/${encodeURIComponent(
                    item.turfId
                  )}`,
                  {
                    method: "GET",
                    signal: controller.signal,
                  }
                );

                if (!turfResponse.ok) return null;

                const turfResponseData =
                  await turfResponse
                    .json()
                    .catch(() => ({}));

                const turf =
                  turfResponseData?.turf ||
                  turfResponseData?.data ||
                  turfResponseData;

                if (
                  !turf ||
                  typeof turf !== "object" ||
                  Array.isArray(turf)
                ) {
                  return null;
                }

                return {
                  ...item,
                  name: turf.name || "Unnamed Turf",
                  image: turf.image || "",
                  location:
                    turf.location ||
                    turf.area ||
                    "Dhaka, Bangladesh",
                  area: turf.area || "",
                  sport: turf.sport || "Sports Turf",
                  surface: turf.surface || "",
                  size: turf.size || "",
                  price: turf.price ?? 0,
                  rating: turf.rating ?? null,
                  reviews: turf.reviews ?? 0,
                  facilities: Array.isArray(
                    turf.amenities
                  )
                    ? turf.amenities
                    : Array.isArray(turf.features)
                      ? turf.features
                      : [],
                };
              } catch (error) {
                if (error?.name === "AbortError") {
                  throw error;
                }

                console.error(
                  `Failed to load turf ${item.turfId}:`,
                  error
                );

                return null;
              }
            })
          );

          setWishlistTurfs(
            resolvedItems.filter(Boolean)
          );
        } else {
          setWishlistTurfs(normalizedItems);
        }
      } catch (error) {
        if (error?.name === "AbortError") return;

        console.error("Wishlist fetch error:", error);

        setWishlistTurfs([]);
        setError(
          error?.message ||
            "Failed to load your wishlist."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchWishlist();

    return () => {
      controller.abort();
    };
  }, [userEmail]);

  const handleRemove = async (turfId) => {
    if (!userEmail || !turfId || removingId) return;

    try {
      setRemovingId(String(turfId));

      const encodedEmail =
        encodeURIComponent(userEmail);

      const encodedTurfId = encodeURIComponent(
        String(turfId)
      );

      const response = await fetch(
        `${API_URL}/wishlist/${encodedEmail}/${encodedTurfId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to remove wishlist (${response.status})`
        );
      }

      setWishlistTurfs((previous) =>
        previous.filter(
          (turf) =>
            String(turf.turfId) !==
            String(turfId)
        )
      );

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Removed from wishlist",
        showConfirmButton: false,
        timer: 1400,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      await Swal.fire({
        icon: "error",
        title: "Remove failed",
        text:
          error?.message ||
          "Failed to remove turf from wishlist.",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setRemovingId("");
    }
  };

  const getRating = (turf) => {
    const rating = Number(turf?.rating);

    return Number.isFinite(rating)
      ? rating.toFixed(1)
      : "New";
  };

  const getPrice = (turf) => {
    const price = Number(turf?.price);

    return Number.isFinite(price) && price >= 0
      ? price
      : 0;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Link
              to="/turfs"
              className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-green-600"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              Back to Turfs
            </Link>

            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <Heart
                    size={13}
                    fill="currentColor"
                  />
                  Saved Turfs
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Your Wishlist
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                  Keep your favorite turfs saved so you
                  can quickly find them when you're ready
                  to play.
                </p>
              </div>

              {!loading && !error && (
                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm">
                  <Sparkles
                    size={16}
                    className="text-green-600"
                  />

                  <span className="font-semibold text-gray-900">
                    {wishlistTurfs.length}
                  </span>

                  <span className="text-gray-500">
                    {wishlistTurfs.length === 1
                      ? "saved turf"
                      : "saved turfs"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Loading */}
        {loading && (
          <div className="animate-in fade-in duration-500">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="aspect-[16/10] animate-pulse bg-gray-200" />

                  <div className="space-y-4 p-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                    <div className="flex gap-2">
                      <div className="h-7 w-16 animate-pulse rounded-full bg-gray-100" />
                      <div className="h-7 w-20 animate-pulse rounded-full bg-gray-100" />
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div className="flex justify-between">
                      <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
                      <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2
                size={17}
                className="animate-spin text-green-600"
              />
              Loading your wishlist...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="animate-in fade-in slide-in-from-bottom-3 mx-auto max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm duration-500">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <RefreshCw size={25} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              Unable to load wishlist
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* Wishlist */}
        {!loading && !error && (
          <>
            {wishlistTurfs.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {wishlistTurfs.map((turf, index) => {
                  const turfId = String(
                    turf.turfId || ""
                  ).trim();

                  const turfName =
                    turf.name || "Unnamed Turf";

                  const image =
                    typeof turf.image === "string" &&
                    turf.image.trim()
                      ? turf.image.trim()
                      : FALLBACK_IMAGE;

                  const rating = getRating(turf);
                  const price = getPrice(turf);

                  return (
                    <article
                      key={
                        turf.wishlistId ||
                        turfId
                      }
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                      className="animate-in fade-in slide-in-from-bottom-4 group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm duration-500 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-gray-200/60"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={image}
                          alt={turfName}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                          onError={(event) => {
                            if (
                              event.currentTarget
                                .src !== FALLBACK_IMAGE
                            ) {
                              event.currentTarget.src =
                                FALLBACK_IMAGE;
                            }
                          }}
                        />

                        {/* Image overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-70 transition duration-300 group-hover:opacity-80" />

                        {/* Sport */}
                        <div className="absolute left-4 top-4">
                          <span className="inline-flex rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur">
                            {turf.sport ||
                              "Sports Turf"}
                          </span>
                        </div>

                        {/* Wishlist button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(turfId)
                          }
                          disabled={
                            removingId === turfId
                          }
                          aria-label={`Remove ${turfName} from wishlist`}
                          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/95 text-red-500 shadow-sm backdrop-blur transition duration-200 hover:scale-105 hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {removingId ===
                          turfId ? (
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <Heart
                              size={18}
                              fill="currentColor"
                              className="transition-transform duration-200 hover:scale-110"
                            />
                          )}
                        </button>

                        {/* Rating */}
                        <div className="absolute bottom-4 left-4">
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                            <Star
                              size={13}
                              fill={
                                rating !== "New"
                                  ? "currentColor"
                                  : "none"
                              }
                              className="text-amber-400"
                            />

                            <span>{rating}</span>

                            {Number(
                              turf.reviews
                            ) > 0 && (
                              <span className="font-normal text-white/70">
                                ({turf.reviews})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                              {turf.sport ||
                                "Sports Turf"}
                            </p>

                            <h2
                              className="mt-1.5 truncate text-lg font-bold text-gray-900"
                              title={turfName}
                            >
                              {turfName}
                            </h2>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                          <MapPin
                            size={15}
                            className="mt-0.5 shrink-0 text-green-600"
                          />

                          <span className="line-clamp-2">
                            {turf.location ||
                              turf.area ||
                              "Dhaka, Bangladesh"}
                          </span>
                        </div>

                        {/* Tags */}
                        {(turf.size ||
                          turf.surface ||
                          turf.facilities
                            ?.length > 0) && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {turf.size && (
                              <span className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                                {turf.size}
                              </span>
                            )}

                            {turf.surface && (
                              <span className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                                {turf.surface}
                              </span>
                            )}

                            {turf.facilities
                              ?.slice(0, 2)
                              .map(
                                (
                                  facility,
                                  facilityIndex
                                ) => (
                                  <span
                                    key={`${facility}-${facilityIndex}`}
                                    className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500"
                                  >
                                    {facility}
                                  </span>
                                )
                              )}
                          </div>
                        )}

                        <div className="my-5 h-px bg-gray-100" />

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs text-gray-400">
                              Starting from
                            </p>

                            <p className="mt-1 text-xl font-bold text-gray-900">
                              ৳
                              {price.toLocaleString(
                                "en-BD"
                              )}

                              <span className="ml-1 text-xs font-normal text-gray-400">
                                / hour
                              </span>
                            </p>
                          </div>

                          {turfId ? (
                            <Link
                              to={`/turfs/${encodeURIComponent(
                                turfId
                              )}`}
                              aria-label={`View ${turfName}`}
                              className="group/button flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-md"
                            >
                              <ArrowUpRight
                                size={18}
                                className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                              />
                            </Link>
                          ) : (
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                              <ArrowUpRight
                                size={18}
                              />
                            </span>
                          )}
                        </div>

                        {/* Remove action */}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(turfId)
                          }
                          disabled={
                            removingId === turfId
                          }
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-100 py-2.5 text-xs font-semibold text-gray-500 transition duration-200 hover:border-red-100 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {removingId ===
                          turfId ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}

                          {removingId ===
                          turfId
                            ? "Removing..."
                            : "Remove from wishlist"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Empty state */
              <div className="animate-in fade-in zoom-in-95 rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm duration-500 sm:px-10">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-50" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <Heart
                      size={30}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                <h2 className="mt-7 text-2xl font-bold text-gray-900">
                  Your wishlist is empty
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                  You haven't saved any turfs yet.
                  Explore available turfs and save your
                  favorites for later.
                </p>

                <Link
                  to="/turfs"
                  className="group mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20"
                >
                  Explore Turfs

                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Wishlist;