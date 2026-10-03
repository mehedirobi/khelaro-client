import { useEffect, useState } from "react";
import {
  Heart,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const Wishlist = () => {
  const { currentUser } = useAuth();

  const [wishlistTurfs, setWishlistTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH WISHLIST
  // ==========================================
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser?.email) {
        setWishlistTurfs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const email = encodeURIComponent(
          currentUser.email.trim().toLowerCase()
        );

        const response = await fetch(`${API_URL}/wishlist/${email}`);

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await response.json();

        setWishlistTurfs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Wishlist fetch error:", error);

        setError("Failed to load your wishlist.");
        setWishlistTurfs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [currentUser?.email]);

  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================
  const handleRemove = async (turfId) => {
    if (!currentUser?.email || !turfId) return;

    try {
      setRemovingId(turfId);

      const email = encodeURIComponent(
        currentUser.email.trim().toLowerCase()
      );

      const response = await fetch(
        `${API_URL}/wishlist/${email}/${turfId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove wishlist"
        );
      }

      setWishlistTurfs((prev) =>
        prev.filter(
          (turf) => String(turf.turfId) !== String(turfId)
        )
      );
    } catch (error) {
      console.error("Remove wishlist error:", error);

      alert(error.message || "Failed to remove turf");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main>
      {/* ================= HEADER ================= */}
      <div>
        {/* Back to Home */}
        <Link
          to="/"
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-600
            px-5
            text-sm
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-green-700
            hover:shadow-md
            hover:shadow-green-600/20
          "
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header Content */}
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

      {/* ================= LOADING ================= */}
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

      {/* ================= ERROR ================= */}
      {!loading && error && (
        <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* ================= WISHLIST ================= */}
      {!loading && !error && (
        <>
          {wishlistTurfs.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {wishlistTurfs.map((turf) => (
                <article
                  key={turf.wishlistId || turf.turfId}
                  className="
                    group overflow-hidden
                    rounded-2xl
                    border border-gray-200
                    bg-white
                    transition
                    hover:-translate-y-1
                    hover:border-gray-300
                    hover:shadow-lg
                  "
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {turf.image ? (
                      <img
                        src={turf.image}
                        alt={turf.name}
                        className="
                          h-full w-full object-cover
                          transition duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image available
                      </div>
                    )}

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemove(turf.turfId)}
                      disabled={removingId === turf.turfId}
                      aria-label={`Remove ${turf.name} from wishlist`}
                      className="
                        absolute right-4 top-4
                        flex h-10 w-10
                        items-center justify-center
                        rounded-full
                        bg-white
                        text-red-500
                        shadow-sm
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {removingId === turf.turfId ? (
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
                        <span className="text-xs font-medium text-green-600">
                          {turf.surface || "Sports Turf"}
                        </span>

                        <h2 className="mt-1 truncate font-semibold text-gray-900">
                          {turf.name}
                        </h2>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-600">
                        <Star
                          size={15}
                          fill="currentColor"
                        />

                        <span>New</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mt-3 flex items-start gap-1.5 text-sm text-gray-500">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0"
                      />

                      <span>
                        {turf.location || "Dhaka, Bangladesh"}
                      </span>
                    </div>

                    {/* Turf Info */}
                    {(turf.size || turf.facilities?.length > 0) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {turf.size && (
                          <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500">
                            {turf.size}
                          </span>
                        )}

                        {turf.facilities
                          ?.slice(0, 2)
                          .map((facility) => (
                            <span
                              key={facility}
                              className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500"
                            >
                              {facility}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="my-5 h-px bg-gray-100" />

                    {/* Price + Details */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">
                          Starting from
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          ৳
                          {Number(
                            turf.price || 0
                          ).toLocaleString()}

                          <span className="ml-1 text-xs font-normal text-gray-400">
                            / hour
                          </span>
                        </p>
                      </div>

                      <Link
                        to={`/turfs/${turf.turfId}`}
                        aria-label={`View ${turf.name}`}
                        className="
                          flex h-10 w-10
                          items-center justify-center
                          rounded-xl
                          bg-gray-900
                          text-white
                          transition
                          hover:bg-green-600
                        "
                      >
                        <ArrowUpRight size={17} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* ================= EMPTY ================= */
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white py-20 text-center">
              <Heart
                size={38}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                Your wishlist is empty
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Save your favorite turfs and find them here later.
              </p>

              <Link
                to="/turfs"
                className="
                  mt-6 inline-flex
                  rounded-xl
                  bg-green-600
                  px-5 py-3
                  text-sm font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                "
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