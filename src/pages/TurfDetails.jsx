import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
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
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const TurfDetails = () => {
  const params = useParams();
  const location = useLocation();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  // Supports different route parameter names.
  const routeId =
    params.id ||
    params.turfId ||
    params.slug ||
    "";

  // Fallback: get the last part from the current URL.
  const pathnameId = location.pathname
    .split("/")
    .filter(Boolean)
    .pop();

  const turfIdentifier = decodeURIComponent(
    String(routeId || pathnameId || "")
  ).trim();

  useEffect(() => {
    const controller = new AbortController();

    const fetchTurfDetails = async () => {
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

        const endpoint = `${API_URL}/turfs/${encodeURIComponent(
          turfIdentifier
        )}`;

        console.log("Loading turf:", endpoint);

        const response = await fetch(endpoint, {
          method: "GET",
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        console.log("Turf details response:", data);

        if (!response.ok) {
          throw new Error(
            data?.message ||
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
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(
          "Failed to load turf details:",
          error
        );

        setTurf(null);

        setError(
          error?.message ||
            "Failed to load turf details. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTurfDetails();

    return () => {
      controller.abort();
    };
  }, [turfIdentifier]);

  const handleImageError = (event) => {
    setImageLoading(false);

    if (event.currentTarget.src !== FALLBACK_IMAGE) {
      event.currentTarget.src = FALLBACK_IMAGE;
    }
  };

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

  const turfId = String(
    turf.id ||
      turf._id ||
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

  const ratingValue = Number(turf.rating);

  const hasRating =
    turf.rating !== undefined &&
    turf.rating !== null &&
    turf.rating !== "" &&
    Number.isFinite(ratingValue);

  const turfRating = hasRating
    ? ratingValue.toFixed(1)
    : "New";

  const reviewsValue = Number(turf.reviews);

  const safeReviews =
    Number.isFinite(reviewsValue) &&
    reviewsValue >= 0
      ? reviewsValue
      : 0;

  const priceValue = Number(turf.price);

  const safePrice =
    Number.isFinite(priceValue) &&
    priceValue >= 0
      ? priceValue
      : 0;

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

  const facilities = Array.isArray(turf.amenities)
    ? turf.amenities.filter(Boolean)
    : Array.isArray(turf.features)
      ? turf.features.filter(Boolean)
      : [];

  const bookingUrl = turfId
    ? `/turfs/${encodeURIComponent(turfId)}/book`
    : "/turfs";

  return (
    <main className="min-h-screen bg-gray-50">
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

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-gray-200">
              {imageLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                  <Loader2
                    size={28}
                    className="animate-spin text-green-600"
                  />
                </div>
              )}

              <img
                src={turfImage}
                alt={`${turfName} turf`}
                loading="eager"
                onLoad={() => setImageLoading(false)}
                onError={handleImageError}
                className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[470px]"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {turfSport}
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
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

                <div className="flex shrink-0 items-center gap-2">
                  <Star
                    size={18}
                    className={
                      hasRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />

                  <span className="font-semibold text-gray-900">
                    {turfRating}
                  </span>

                  <span className="text-sm text-gray-400">
                    ({safeReviews} reviews)
                  </span>
                </div>
              </div>

              <div className="my-7 h-px bg-gray-100" />

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  About this turf
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {description}
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
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

              {facilities.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Facilities
                  </h2>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {facilities.map((facility, index) => (
                      <div
                        key={`${String(facility)}-${index}`}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle2
                          size={17}
                          className="shrink-0 text-green-600"
                        />

                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Starting from
                  </p>

                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ৳{safePrice.toLocaleString("en-BD")}
                    </span>

                    <span className="text-sm text-gray-400">
                      / hour
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5">
                  <Star
                    size={15}
                    className={
                      hasRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />

                  <span className="text-sm font-semibold text-green-700">
                    {turfRating}
                  </span>
                </div>
              </div>

              <div className="my-6 h-px bg-gray-100" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Availability
                    </p>

                    <Link
                      to={bookingUrl}
                      className="text-sm font-medium text-gray-900 transition hover:text-green-600"
                    >
                      Check available slots
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
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

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <MapPin size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      Location
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {turfLocation}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to={bookingUrl}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Check Availability
                <ArrowRight size={17} />
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                Select your preferred date and time to see available slots.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="rounded-xl bg-gray-50 p-4">
    <div className="text-green-600">{icon}</div>

    <p className="mt-3 text-xs text-gray-400">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-gray-900">
      {value}
    </p>
  </div>
);

const TurfLoading = () => (
  <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
    <div className="text-center">
      <Loader2
        size={32}
        className="mx-auto animate-spin text-green-600"
      />

      <h1 className="mt-5 text-xl font-semibold text-gray-900">
        Loading turf...
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Please wait while we load the turf details.
      </p>
    </div>
  </main>
);

const TurfError = ({ message }) => (
  <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertCircle
          size={26}
          className="text-red-500"
        />
      </div>

      <h1 className="mt-5 text-2xl font-bold text-gray-900">
        Unable to load turf
      </h1>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {message}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          <RefreshCw size={16} />
          Try again
        </button>

        <Link
          to="/turfs"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <ArrowLeft size={17} />
          Back to Turfs
        </Link>
      </div>
    </div>
  </main>
);

export default TurfDetails;