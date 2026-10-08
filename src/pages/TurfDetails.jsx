import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Star,
  Users,
  AlertCircle,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const TurfDetails = () => {
  const {
    id: routeId,
    turfId: routeTurfId,
    slug: routeSlug,
  } = useParams();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState("");

  const turfIdentifier = decodeURIComponent(
    String(
      routeId ||
        routeTurfId ||
        routeSlug ||
        ""
    )
  ).trim();

  useEffect(() => {
    const controller = new AbortController();

    const loadTurf = async () => {
      if (!turfIdentifier) {
        setTurf(null);
        setError("Invalid turf ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setTurf(null);
        setImageLoading(true);

        const response = await fetch(
          `${API_URL}/turfs/${encodeURIComponent(
            turfIdentifier
          )}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "The requested turf could not be found."
          );
        }

        const turfData =
          data?.turf ||
          data?.data ||
          data;

        if (
          !turfData ||
          typeof turfData !== "object" ||
          Array.isArray(turfData)
        ) {
          throw new Error(
            "Invalid turf data received from server."
          );
        }

        setTurf(turfData);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(
          "Turf details error:",
          err
        );

        setTurf(null);
        setError(
          err?.message ||
            "Failed to load turf details."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadTurf();

    return () => {
      controller.abort();
    };
  }, [turfIdentifier]);

  if (loading) {
    return <TurfLoading />;
  }

  if (!turf) {
    return (
      <TurfError
        message={
          error ||
          "The requested turf could not be found."
        }
      />
    );
  }

  /*
   * Actual turf ID from MongoDB.
   * This is intentionally different from
   * the route parameter variable.
   */
  const turfId = String(
    turf._id ||
      turf.id ||
      turf.turfId ||
      turfIdentifier ||
      ""
  ).trim();

  const turfName = String(
    turf.name || "Unnamed Turf"
  ).trim();

  const turfImage =
    typeof turf.image === "string" &&
    turf.image.trim()
      ? turf.image.trim()
      : FALLBACK_IMAGE;

  const turfLocation = String(
    turf.location ||
      turf.area ||
      "Dhaka, Bangladesh"
  ).trim();

  const turfSport = String(
    turf.sport || "Sports Turf"
  ).trim();

  const turfSize = String(
    turf.size || "Standard"
  ).trim();

  const turfSurface = String(
    turf.surface || "Artificial Grass"
  ).trim();

  const openingTime = String(
    turf.openingTime || "8:00 AM"
  ).trim();

  const closingTime = String(
    turf.closingTime || "11:00 PM"
  ).trim();

  const description = String(
    turf.description ||
      "A quality sports turf where you can enjoy your game with friends and teammates."
  ).trim();

  const ratingValue = Number(turf.rating);

  const hasRating =
    Number.isFinite(ratingValue) &&
    ratingValue >= 0;

  const rating = hasRating
    ? ratingValue.toFixed(1)
    : "New";

  const reviewsValue = Number(turf.reviews);

  const reviews =
    Number.isFinite(reviewsValue) &&
    reviewsValue >= 0
      ? reviewsValue
      : 0;

  const priceValue = Number(turf.price);

  const price =
    Number.isFinite(priceValue) &&
    priceValue >= 0
      ? priceValue
      : 0;

  const facilities = Array.isArray(
    turf.amenities
  )
    ? turf.amenities.filter(Boolean)
    : Array.isArray(turf.features)
      ? turf.features.filter(Boolean)
      : [];

  const bookingUrl = turfId
    ? `/turfs/${encodeURIComponent(
        turfId
      )}/book`
    : "/turfs";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back navigation */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/turfs"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-green-600"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />

            Back to all turfs
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Hero image */}
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <div className="group relative overflow-hidden rounded-3xl bg-gray-200 shadow-sm">
                {imageLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2
                        size={30}
                        className="animate-spin text-green-600"
                      />

                      <span className="text-xs font-medium text-gray-400">
                        Loading image...
                      </span>
                    </div>
                  </div>
                )}

                <img
                  src={turfImage}
                  alt={`${turfName} turf`}
                  loading="eager"
                  onLoad={() =>
                    setImageLoading(false)
                  }
                  onError={(event) => {
                    setImageLoading(false);

                    if (
                      event.currentTarget.src !==
                      FALLBACK_IMAGE
                    ) {
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }
                  }}
                  className="h-[280px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] sm:h-[400px] lg:h-[480px]"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />

                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  {turfSport}
                </div>

                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
                  <Star
                    size={14}
                    className={
                      hasRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />

                  <span className="text-xs font-bold text-gray-900">
                    {rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Main information */}
            <div className="animate-[fadeInUp_0.55s_ease-out] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    {turfSport}
                  </span>

                  <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {turfName}
                  </h1>

                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <span>{turfLocation}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-gray-50 px-3 py-2">
                  <Star
                    size={17}
                    className={
                      hasRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />

                  <span className="font-bold text-gray-900">
                    {rating}
                  </span>

                  <span className="text-sm text-gray-400">
                    ({reviews})
                  </span>
                </div>
              </div>

              <div className="my-7 h-px bg-gray-100" />

              {/* About */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900">
                  About this turf
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-[15px]">
                  {description}
                </p>
              </section>

              {/* Turf information */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <InfoCard
                  icon={<Users size={19} />}
                  label="Turf Size"
                  value={turfSize}
                />

                <InfoCard
                  icon={<ShieldCheck size={19} />}
                  label="Surface"
                  value={turfSurface}
                />

                <InfoCard
                  icon={<Clock3 size={19} />}
                  label="Opening Hours"
                  value={`${openingTime} - ${closingTime}`}
                />
              </div>

              {/* Facilities */}
              {facilities.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Facilities & Amenities
                  </h2>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {facilities.map(
                      (facility, index) => (
                        <div
                          key={`${String(
                            facility
                          )}-${index}`}
                          className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-100 hover:bg-green-50"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 transition-transform duration-200 group-hover:scale-110">
                            <CheckCircle2
                              size={16}
                            />
                          </div>

                          <span className="text-sm font-medium text-gray-600">
                            {facility}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside>
            <div className="animate-[fadeInUp_0.65s_ease-out] lg:sticky lg:top-24">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
                {/* Price */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Starting from
                    </p>

                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight text-gray-900">
                        ৳{price.toLocaleString("en-BD")}
                      </span>

                      <span className="text-sm text-gray-400">
                        / hour
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2">
                    <Star
                      size={15}
                      className={
                        hasRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />

                    <span className="text-sm font-bold text-green-700">
                      {rating}
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-gray-100" />

                {/* Quick information */}
                <div className="space-y-4">
                  <BookingInfo
                    icon={
                      <CalendarDays size={19} />
                    }
                    label="Availability"
                    value="Check available slots"
                    link={bookingUrl}
                  />

                  <BookingInfo
                    icon={<Clock3 size={19} />}
                    label="Opening Hours"
                    value={`${openingTime} - ${closingTime}`}
                  />

                  <BookingInfo
                    icon={<MapPin size={19} />}
                    label="Location"
                    value={turfLocation}
                  />
                </div>

                {/* CTA */}
                <Link
                  to={bookingUrl}
                  className="group mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Check Availability

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>

                {/* Security note */}
                <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-gray-50 p-3.5">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <p className="text-xs leading-5 text-gray-500">
                    Select your preferred date and
                    time to see available slots and
                    complete your booking.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-100 hover:bg-green-50">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm transition-transform duration-200 group-hover:scale-105">
        {icon}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};

const BookingInfo = ({
  icon,
  label,
  value,
  link,
}) => {
  const content = (
    <div className="group flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-all duration-200 group-hover:scale-105 group-hover:bg-green-100">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p
          className={`mt-0.5 text-sm font-medium ${
            link
              ? "text-gray-900 transition-colors group-hover:text-green-600"
              : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

const TurfLoading = () => {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="animate-pulse">
          <div className="h-5 w-32 rounded bg-gray-200" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.55fr_1fr]">
            <div>
              <div className="h-[300px] rounded-3xl bg-gray-200 sm:h-[400px] lg:h-[480px]" />

              <div className="mt-6 rounded-3xl bg-white p-8">
                <div className="h-5 w-20 rounded bg-gray-200" />

                <div className="mt-4 h-9 w-2/3 rounded bg-gray-200" />

                <div className="mt-3 h-4 w-1/3 rounded bg-gray-200" />

                <div className="mt-8 h-px bg-gray-100" />

                <div className="mt-8 h-5 w-40 rounded bg-gray-200" />

                <div className="mt-4 h-20 rounded bg-gray-100" />
              </div>
            </div>

            <div>
              <div className="h-[450px] rounded-3xl bg-white" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const TurfError = ({ message }) => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle
            size={28}
            className="text-red-500"
          />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Unable to load turf
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {message}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
          >
            <RefreshCw size={16} />
            Try again
          </button>

          <Link
            to="/turfs"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700"
          >
            <ArrowLeft size={17} />
            Back to Turfs
          </Link>
        </div>
      </div>
    </main>
  );
};

export default TurfDetails;