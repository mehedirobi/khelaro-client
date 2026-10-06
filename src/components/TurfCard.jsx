import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Heart,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

import useAuth from "../hooks/useAuth";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/800x600?text=No+Turf+Image";

const TurfCard = ({ turf }) => {
  const { currentUser } = useAuth();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistChecking, setWishlistChecking] = useState(false);
  const [wishlistAnimation, setWishlistAnimation] = useState(false);

  // MongoDB _id is the primary turf ID
  const turfId = turf?._id ? String(turf._id).trim() : "";

  const turfName = String(turf?.name || "Unnamed Turf").trim();

  const turfImage =
    typeof turf?.image === "string" && turf.image.trim()
      ? turf.image.trim()
      : FALLBACK_IMAGE;

  const turfLocation =
    String(turf?.location || turf?.area || "Dhaka, Bangladesh").trim();

  const turfArea = String(turf?.area || "").trim();

  const turfSport = String(turf?.sport || "Sports Turf").trim();

  const turfSize = String(turf?.size || "").trim();

  const turfSurface = String(turf?.surface || "").trim();

  const ratingValue = Number(turf?.rating);

  const hasRating =
    turf?.rating !== undefined &&
    turf?.rating !== null &&
    turf?.rating !== "" &&
    !Number.isNaN(ratingValue);

  const turfRating = hasRating ? ratingValue : null;

  const turfPrice = Number(turf?.price);

  const safePrice = Number.isFinite(turfPrice) ? turfPrice : 0;

  const userEmail = currentUser?.email
    ? String(currentUser.email).trim().toLowerCase()
    : "";

  useEffect(() => {
    const controller = new AbortController();

    const checkWishlistStatus = async () => {
      if (!userEmail || !turfId) {
        setIsWishlisted(false);
        setWishlistChecking(false);
        return;
      }

      try {
        setWishlistChecking(true);

        const response = await fetch(
          `${API_URL}/wishlist/${encodeURIComponent(
            userEmail
          )}/${encodeURIComponent(turfId)}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to check wishlist status"
          );
        }

        setIsWishlisted(Boolean(data?.wishlisted));
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Wishlist status error:", error);
        setIsWishlisted(false);
      } finally {
        if (!controller.signal.aborted) {
          setWishlistChecking(false);
        }
      }
    };

    checkWishlistStatus();

    return () => {
      controller.abort();
    };
  }, [userEmail, turfId]);

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userEmail) {
      await Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please login to save turfs to your wishlist.",
        confirmButtonColor: "#16a34a",
      });

      return;
    }

    if (!turfId) {
      await Swal.fire({
        icon: "error",
        title: "Invalid turf",
        text: "This turf does not have a valid MongoDB ID.",
        confirmButtonColor: "#16a34a",
      });

      return;
    }

    if (wishlistLoading || wishlistChecking) {
      return;
    }

    try {
      setWishlistLoading(true);

      const response = await fetch(`${API_URL}/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          turfId,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || `Wishlist request failed (${response.status})`
        );
      }

      const newStatus = Boolean(data?.wishlisted);

      setIsWishlisted(newStatus);

      if (newStatus) {
        setWishlistAnimation(true);

        window.setTimeout(() => {
          setWishlistAnimation(false);
        }, 600);
      }

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: newStatus
          ? "Added to wishlist"
          : "Removed from wishlist",
        text: newStatus
          ? `${turfName} saved to your wishlist.`
          : `${turfName} removed from your wishlist.`,
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Wishlist request failed:", error);

      await Swal.fire({
        icon: "error",
        title: "Wishlist failed",
        text:
          error?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleImageError = (event) => {
    if (event.currentTarget.src !== FALLBACK_IMAGE) {
      event.currentTarget.src = FALLBACK_IMAGE;
    }
  };

  const isAvailable = turf?.available !== false;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-100">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={turfImage}
          alt={turfName}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={handleImageError}
        />

        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm">
            {turfSport}
          </span>

          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishlistLoading || wishlistChecking}
            aria-label={
              isWishlisted
                ? `Remove ${turfName} from wishlist`
                : `Add ${turfName} to wishlist`
            }
            aria-pressed={isWishlisted}
            className={`relative z-30 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-70 ${
              isWishlisted
                ? "text-red-500"
                : "text-gray-600 hover:text-red-500"
            } ${wishlistAnimation ? "scale-125" : ""}`}
          >
            {wishlistAnimation && (
              <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-red-400/30" />
            )}

            {wishlistLoading || wishlistChecking ? (
              <Loader2
                size={18}
                className="relative z-10 animate-spin"
              />
            ) : (
              <Heart
                size={18}
                strokeWidth={2}
                className="relative z-10"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            )}
          </button>
        </div>

        <div className="absolute bottom-4 left-4 z-10">
          <span className="rounded-full bg-gray-950/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {isAvailable
              ? "Available today"
              : "Currently unavailable"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="truncate font-semibold text-gray-900"
              title={turfName}
            >
              {turfName}
            </h3>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={14} className="shrink-0" />

              <span
                className="truncate"
                title={turfLocation}
              >
                {turfLocation}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
            <Star
              size={13}
              fill={hasRating ? "currentColor" : "none"}
            />

            <span>{hasRating ? turfRating : "New"}</span>
          </div>
        </div>

        {(turfArea || turfSize || turfSurface) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {turfArea && (
              <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-500">
                {turfArea}
              </span>
            )}

            {turfSize && (
              <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-500">
                {turfSize}
              </span>
            )}

            {turfSurface && (
              <span className="rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-500">
                {turfSurface}
              </span>
            )}
          </div>
        )}

        <div className="my-4 border-t border-gray-100" />

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">
              Starting from
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              ৳{safePrice.toLocaleString("en-BD")}

              <span className="ml-1 text-xs font-normal text-gray-400">
                / hour
              </span>
            </p>
          </div>

          {turfId ? (
            <Link
              to={`/turfs/${encodeURIComponent(turfId)}`}
              aria-label={`View details for ${turfName}`}
              className="group/link inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-green-600"
            >
              View details

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              />
            </Link>
          ) : (
            <span className="inline-flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-lg bg-gray-200 px-3.5 py-2.5 text-xs font-semibold text-gray-400">
              Details unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default TurfCard;