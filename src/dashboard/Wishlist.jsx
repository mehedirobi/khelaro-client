import { useEffect, useState } from "react";
import {
  Heart,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
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

        /*
         * Backend may return:
         *
         * 1. Array directly
         * 2. { wishlist: [...] }
         * 3. { data: [...] }
         */
        const wishlistItems = Array.isArray(data)
          ? data
          : Array.isArray(data?.wishlist)
            ? data.wishlist
            : Array.isArray(data?.data)
              ? data.data
              : [];

        /*
         * If backend already returns complete turf objects,
         * use them directly.
         *
         * Otherwise, fetch each turf using its turfId.
         */
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

            if (!turfId) {
              return null;
            }

            /*
             * Backend may return:
             * {
             *   turfId,
             *   name,
             *   image,
             *   location
             * }
             *
             * or:
             * {
             *   turfId,
             *   turf: {...}
             * }
             */
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

        /*
         * If the wishlist endpoint only returns IDs,
         * load the actual turf information.
         */
        const incompleteItems = normalizedItems.filter(
          (item) =>
            !item.name &&
            item.turfId
        );

        if (incompleteItems.length > 0) {
          const resolvedItems = await Promise.all(
            normalizedItems.map(async (item) => {
              if (item.name) {
                return item;
              }

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

                if (!turfResponse.ok) {
                  return null;
                }

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

                  name:
                    turf.name ||
                    "Unnamed Turf",

                  image:
                    turf.image ||
                    "",

                  location:
                    turf.location ||
                    turf.area ||
                    "Dhaka, Bangladesh",

                  area:
                    turf.area ||
                    "",

                  sport:
                    turf.sport ||
                    "Sports Turf",

                  surface:
                    turf.surface ||
                    "",

                  size:
                    turf.size ||
                    "",

                  price:
                    turf.price ?? 0,

                  rating:
                    turf.rating ?? null,

                  reviews:
                    turf.reviews ?? 0,

                  facilities:
                    Array.isArray(
                      turf.amenities
                    )
                      ? turf.amenities
                      : Array.isArray(
                            turf.features
                          )
                        ? turf.features
                        : [],
                };
              } catch (error) {
                if (
                  error?.name ===
                  "AbortError"
                ) {
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
        if (error?.name === "AbortError") {
          return;
        }

        console.error(
          "Wishlist fetch error:",
          error
        );

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
    if (!userEmail || !turfId || removingId) {
      return;
    }

    try {
      setRemovingId(String(turfId));

      const encodedEmail =
        encodeURIComponent(userEmail);

      const encodedTurfId =
        encodeURIComponent(String(turfId));

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
    <main className="min-h-screen">
      {/* Header */}
      <div>
        <Link
          to="/turfs"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-700 hover:shadow-md hover:shadow-green-600/20"
        >
          <ArrowLeft size={16} />
          Back to Turfs
        </Link>

        <div className="mt-5">
          <p className="text-sm font-medium text-green-600">
            Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Wishlist
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your saved turfs for future games.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-10 flex flex-col items-center justify-center py-16">
          <Loader2
            size={32}
            className="animate-spin text-green-600"
          />

          <p className="mt-4 text-sm text-gray-500">
            Loading your wishlist...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
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
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {wishlistTurfs.map((turf) => {
                const turfId = String(
                  turf.turfId || ""
                ).trim();

                const turfName =
                  turf.name ||
                  "Unnamed Turf";

                const image =
                  typeof turf.image ===
                    "string" &&
                  turf.image.trim()
                    ? turf.image.trim()
                    : FALLBACK_IMAGE;

                const rating =
                  getRating(turf);

                const price =
                  getPrice(turf);

                return (
                  <article
                    key={
                      turf.wishlistId ||
                      turfId
                    }
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={turfName}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(
                          event
                        ) => {
                          if (
                            event.currentTarget
                              .src !==
                            FALLBACK_IMAGE
                          ) {
                            event.currentTarget.src =
                              FALLBACK_IMAGE;
                          }
                        }}
                      />

                      {/* Sport */}
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur">
                          {turf.sport ||
                            "Sports Turf"}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(
                            turfId
                          )
                        }
                        disabled={
                          removingId ===
                          turfId
                        }
                        aria-label={`Remove ${turfName} from wishlist`}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                          />
                        )}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-green-600">
                            {turf.sport ||
                              "Sports Turf"}
                          </p>

                          <h2
                            className="mt-1 truncate font-semibold text-gray-900"
                            title={turfName}
                          >
                            {turfName}
                          </h2>
                        </div>

                        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                          <Star
                            size={14}
                            fill={
                              rating !==
                              "New"
                                ? "currentColor"
                                : "none"
                            }
                          />

                          <span>
                            {rating}
                          </span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="mt-3 flex items-start gap-1.5 text-sm text-gray-500">
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0"
                        />

                        <span className="line-clamp-2">
                          {turf.location ||
                            turf.area ||
                            "Dhaka, Bangladesh"}
                        </span>
                      </div>

                      {/* Turf Info */}
                      {(turf.size ||
                        turf.surface ||
                        turf.facilities
                          ?.length >
                          0) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {turf.size && (
                            <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500">
                              {turf.size}
                            </span>
                          )}

                          {turf.surface && (
                            <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500">
                              {turf.surface}
                            </span>
                          )}

                          {turf.facilities
                            ?.slice(0, 2)
                            .map(
                              (
                                facility,
                                index
                              ) => (
                                <span
                                  key={`${facility}-${index}`}
                                  className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500"
                                >
                                  {
                                    facility
                                  }
                                </span>
                              )
                            )}
                        </div>
                      )}

                      <div className="my-5 h-px bg-gray-100" />

                      {/* Price + Details */}
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            Starting from
                          </p>

                          <p className="mt-1 text-lg font-bold text-gray-900">
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
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-green-600"
                          >
                            <ArrowUpRight
                              size={17}
                            />
                          </Link>
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-400">
                            <ArrowUpRight
                              size={17}
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white py-20 text-center">
              <Heart
                size={38}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                Your wishlist is empty
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Save your favorite turfs and
                find them here later.
              </p>

              <Link
                to="/turfs"
                className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Explore Turfs
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Wishlist;