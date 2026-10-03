import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Star,
  Users,
  CalendarDays,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const TurfDetails = () => {
  const { id } = useParams();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchTurf = async () => {
      if (!id) {
        setError("Invalid turf ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/turfs/${encodeURIComponent(id)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load turf."
          );
        }

        if (mounted) {
          setTurf(data);
        }
      } catch (error) {
        console.error("Failed to fetch turf:", error);

        if (mounted) {
          setError(
            error?.message ||
              "Unable to load this turf."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTurf();

    return () => {
      mounted = false;
    };
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2
            size={32}
            className="animate-spin text-green-600"
          />

          <p className="mt-4 text-sm text-gray-500">
            Loading turf...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR / NOT FOUND
  // =====================================================

  if (error || !turf) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Turf not found
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {error ||
              "The turf you are looking for does not exist."}
          </p>

          <Link
            to="/turfs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <ArrowLeft size={17} />
            Back to Turfs
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // NORMALIZE DATA
  // =====================================================

  const turfId = String(turf._id || turf.id || "");

  const turfName = turf.name || "Unnamed Turf";

  const turfImage =
    turf.image || FALLBACK_IMAGE;

  const turfLocation =
    turf.location ||
    `${turf.area || "Dhaka"}, Dhaka`;

  const turfArea =
    turf.area || turf.location || "Dhaka";

  const turfSport =
    turf.sport || "Sports Turf";

  const turfRating =
    turf.rating !== undefined &&
    turf.rating !== null &&
    turf.rating !== ""
      ? turf.rating
      : "New";

  const turfReviews =
    turf.reviews || turf.reviewCount || 0;

  const turfPrice =
    Number(turf.price) || 0;

  const turfSize =
    turf.size || "Standard";

  const turfSurface =
    turf.surface || "Artificial Grass";

  const openingTime =
    turf.openingTime || "08:00 AM";

  const closingTime =
    turf.closingTime || "11:00 PM";

  const description =
    turf.description ||
    "A quality sports turf where you can enjoy your game with friends and teammates.";

  const amenities =
    Array.isArray(turf.amenities) &&
    turf.amenities.length > 0
      ? turf.amenities
      : [
          "Floodlights",
          "Parking",
          "Changing Room",
          "Washroom",
        ];

  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleImageError = (event) => {
    if (event.currentTarget.src !== FALLBACK_IMAGE) {
      event.currentTarget.src = FALLBACK_IMAGE;
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="bg-gray-50">
      {/* Breadcrumb */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/turfs"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft size={16} />
            Back to all turfs
          </Link>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* =================================================
              LEFT
          ================================================= */}

          <div>
            {/* Image */}
            <div className="overflow-hidden rounded-2xl bg-gray-200">
              <img
                src={turfImage}
                alt={turfName}
                onError={handleImageError}
                className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[470px]"
              />
            </div>

            {/* Information */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {turfSport}
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {turfName}
                  </h1>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin
                      size={17}
                      className="shrink-0 text-green-600"
                    />

                    {turfLocation}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Star
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="font-semibold text-gray-900">
                    {turfRating}
                  </span>

                  <span className="text-sm text-gray-400">
                    ({turfReviews} reviews)
                  </span>
                </div>
              </div>

              <div className="my-7 h-px bg-gray-100" />

              {/* About */}
              <h2 className="text-lg font-semibold text-gray-900">
                About this turf
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                {description}
              </p>

              {/* Turf Specs */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4">
                  <Users
                    size={19}
                    className="text-green-600"
                  />

                  <p className="mt-3 text-xs text-gray-400">
                    Turf Size
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {turfSize}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <ShieldCheck
                    size={19}
                    className="text-green-600"
                  />

                  <p className="mt-3 text-xs text-gray-400">
                    Surface
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {turfSurface}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <Clock3
                    size={19}
                    className="text-green-600"
                  />

                  <p className="mt-3 text-xs text-gray-400">
                    Opening Hours
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {openingTime} - {closingTime}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  Amenities
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {amenities.map((amenity, index) => (
                    <div
                      key={`${amenity}-${index}`}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2
                        size={17}
                        className="shrink-0 text-green-600"
                      />

                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              BOOKING CARD
          ================================================= */}

          <div>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Starting from
                  </p>

                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ৳{turfPrice.toLocaleString()}
                    </span>

                    <span className="text-sm text-gray-400">
                      / hour
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5">
                  <Star
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="text-sm font-semibold text-green-700">
                    {turfRating}
                  </span>
                </div>
              </div>

              <div className="my-6 h-px bg-gray-100" />

              <div className="space-y-4">
                {/* Availability */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Availability
                    </p>

                    <Link
                      to={`/turfs/${turfId}/book`}
                      className="text-sm font-medium text-gray-900 transition hover:text-green-600"
                    >
                      Check available slots
                    </Link>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <Clock3 size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Opening Hours
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {openingTime} - {closingTime}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Location
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {turfArea}, Dhaka
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/turfs/${turfId}/book`}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-500"
              >
                Check Availability
                <ArrowRight size={17} />
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                Select your preferred date and time to see available
                slots.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TurfDetails;