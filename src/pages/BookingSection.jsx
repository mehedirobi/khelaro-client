import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Check,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  MapPin,
  Star,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
];

const formatDate = (date) => {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-BD",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

const convertToMinutes = (time) => {
  if (!time) return -1;

  const [timeValue, period] = time.split(" ");
  let [hours, minutes] = timeValue.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

const getNextTime = (time) => {
  const totalMinutes = convertToMinutes(time);

  if (totalMinutes < 0) {
    return "";
  }

  const nextMinutes = totalMinutes + 60;
  const hours24 = Math.floor(nextMinutes / 60) % 24;
  const minutes = nextMinutes % 60;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${String(hours12).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")} ${period}`;
};

const normalizeTime = (time) => {
  if (!time) return "";

  const value = String(time).trim().toUpperCase();

  const match = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
  );

  if (!match) {
    return value;
  }

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3];

  hours = hours % 12 || 12;

  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
};

const getBookingList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.bookings)) {
    return data.bookings;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const BookingSection = () => {
  const { turfId: routeTurfId, id } = useParams();

  const turfIdentifier = decodeURIComponent(
    String(routeTurfId || id || "")
  ).trim();

  const [turf, setTurf] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [bookedSlots, setBookedSlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);
  const [availabilityError, setAvailabilityError] =
    useState("");

  const today = useMemo(() => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      2,
      "0"
    );
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTurf = async () => {
      if (!turfIdentifier) {
        setTurf(null);
        setError("Invalid turf ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/turfs/${encodeURIComponent(
            turfIdentifier
          )}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load turf."
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

        const returnedId = String(
          turfData._id ||
            turfData.id ||
            ""
        ).trim();

        if (!returnedId) {
          throw new Error("Turf ID is missing.");
        }

        setTurf(turfData);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error("Failed to load turf:", err);

        setTurf(null);
        setError(
          err?.message ||
            "Failed to load turf. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTurf();

    return () => {
      controller.abort();
    };
  }, [turfIdentifier]);

  const turfIdValue = String(
    turf?._id ||
      turf?.id ||
      turfIdentifier ||
      ""
  ).trim();

  useEffect(() => {
    const controller = new AbortController();

    const fetchAvailability = async () => {
      if (!turfIdValue || !selectedDate) {
        setBookedSlots([]);
        setAvailabilityError("");
        return;
      }

      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");
        setSelectedSlot("");

        const response = await fetch(
          `${API_URL}/bookings/availability?turfId=${encodeURIComponent(
            turfIdValue
          )}&date=${encodeURIComponent(selectedDate)}`,
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
              "Failed to load available slots."
          );
        }

        const bookings = getBookingList(data);

        const activeBookings = bookings.filter(
          (booking) => {
            const status = String(
              booking?.status || ""
            ).toLowerCase();

            return (
              status === "pending" ||
              status === "confirmed"
            );
          }
        );

        setBookedSlots(activeBookings);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(
          "Failed to load booking availability:",
          err
        );

        setBookedSlots([]);

        setAvailabilityError(
          err?.message ||
            "Failed to load available slots."
        );
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      }
    };

    fetchAvailability();

    return () => {
      controller.abort();
    };
  }, [turfIdValue, selectedDate]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-green-600"
          />

          <p className="mt-4 text-sm text-gray-500">
            Loading turf...
          </p>
        </div>
      </main>
    );
  }

  if (error || !turf) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle
              size={26}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Turf not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "The turf you are trying to book does not exist."}
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

  const turfSize = String(
    turf.size || "Standard"
  ).trim();

  const turfSurface = String(
    turf.surface || "Artificial"
  ).trim();

  const priceValue = Number(turf.price);

  const turfPrice =
    Number.isFinite(priceValue) && priceValue >= 0
      ? priceValue
      : 0;

  const openingTime = String(
    turf.openingTime || "08:00 AM"
  ).trim();

  const closingTime = String(
    turf.closingTime || "11:00 PM"
  ).trim();

  const isToday = selectedDate === today;

  const currentTime = new Date();

  const currentMinutes =
    currentTime.getHours() * 60 +
    currentTime.getMinutes();

  const isPastSlot = (slot) => {
    if (!isToday) {
      return false;
    }

    return (
      convertToMinutes(slot) <= currentMinutes
    );
  };

  const isSlotBooked = (slot) => {
    const slotStart = convertToMinutes(slot);
    const slotEnd = slotStart + 60;

    return bookedSlots.some((booking) => {
      const bookingStart = convertToMinutes(
        normalizeTime(booking?.startTime)
      );

      const bookingEnd = convertToMinutes(
        normalizeTime(booking?.endTime)
      );

      if (
        bookingStart < 0 ||
        bookingEnd < 0
      ) {
        return false;
      }

      return (
        slotStart < bookingEnd &&
        slotEnd > bookingStart
      );
    });
  };

  const getSlotStatus = (slot) => {
    if (isSlotBooked(slot)) {
      return "booked";
    }

    if (isPastSlot(slot)) {
      return "past";
    }

    return "available";
  };

  const selectedEndTime = selectedSlot
    ? getNextTime(selectedSlot)
    : "";

  const bookingReady = Boolean(
    selectedDate && selectedSlot
  );

  const bookingUrl = bookingReady
    ? `/booking/${encodeURIComponent(
        turfIdValue
      )}?date=${encodeURIComponent(
        selectedDate
      )}&slot=${encodeURIComponent(
        selectedSlot
      )}`
    : "#";

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={`/turfs/${encodeURIComponent(
              turfIdValue
            )}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft size={16} />
            Back to turf details
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="relative h-64 sm:h-80">
                <img
                  src={turfImage}
                  alt={turfName}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    if (
                      event.currentTarget.src !==
                      FALLBACK_IMAGE
                    ) {
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }
                  }}
                />

                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
                    {turfSport}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      Book {turfName}
                    </h1>

                    <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-green-600"
                      />

                      <span>
                        {turfLocation}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-3 py-2">
                    <Star
                      size={16}
                      className={
                        hasRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />

                    <span className="text-sm font-semibold text-amber-700">
                      {turfRating}
                    </span>
                  </div>
                </div>

                <div className="my-7 h-px bg-gray-100" />

                <h2 className="text-lg font-semibold text-gray-900">
                  Booking information
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  Select your preferred date
                  and available time slot to
                  reserve this turf.
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Turf size
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {turfSize}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Surface
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {turfSurface}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Price
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      ৳
                      {turfPrice.toLocaleString(
                        "en-BD"
                      )}{" "}
                      / hour
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CalendarDays size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Select date & time
                </h2>

                <p className="text-xs text-gray-500">
                  Choose an available slot
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="booking-date"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Select date
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="booking-date"
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(event) => {
                    setSelectedDate(
                      event.target.value
                    );
                    setSelectedSlot("");
                    setAvailabilityError("");
                  }}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-gray-900">
                  Available time slots
                </label>

                {selectedDate &&
                  !availabilityLoading &&
                  !availabilityError && (
                    <span className="text-xs text-green-600">
                      Select one
                    </span>
                  )}
              </div>

              {!selectedDate ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-4 text-sm text-gray-500">
                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    Select a date to check
                    available slots.
                  </span>
                </div>
              ) : availabilityLoading ? (
                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-6 text-sm text-gray-500">
                  <Loader2
                    size={18}
                    className="animate-spin text-green-600"
                  />

                  Checking availability...
                </div>
              ) : availabilityError ? (
                <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <span>
                      {availabilityError}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(
                        (current) => current
                      );
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    <RefreshCw size={13} />
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const status =
                        getSlotStatus(slot);

                      const isSelected =
                        selectedSlot === slot;

                      const disabled =
                        status !== "available";

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            setSelectedSlot(
                              slot
                            )
                          }
                          className={`relative flex items-center justify-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-medium transition ${
                            isSelected
                              ? "border-green-600 bg-green-600 text-white"
                              : status ===
                                "booked"
                              ? "cursor-not-allowed border-red-100 bg-red-50 text-red-400"
                              : status ===
                                "past"
                              ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                              : "border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:bg-green-50 hover:text-green-700"
                          }`}
                        >
                          {isSelected ? (
                            <Check size={14} />
                          ) : status ===
                            "booked" ? (
                            <span className="text-[10px]">
                              Booked
                            </span>
                          ) : (
                            <Clock size={13} />
                          )}

                          {status ===
                          "booked"
                            ? ""
                            : slot}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Available
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      Booked
                    </span>

                    {isToday && (
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-gray-300" />
                        Past
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {bookingReady && (
              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Booking summary
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Date
                    </span>

                    <span className="font-medium text-gray-900">
                      {formatDate(
                        selectedDate
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Clock size={15} />
                      Time
                    </span>

                    <span className="text-right font-medium text-gray-900">
                      {selectedSlot} -{" "}
                      {selectedEndTime}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500">
                          Total price
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          ৳
                          {turfPrice.toLocaleString(
                            "en-BD"
                          )}
                        </p>
                      </div>

                      <span className="text-xs text-gray-500">
                        1 hour
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {bookingReady ? (
              <Link
                to={bookingUrl}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Continue to booking
                <ArrowRight size={17} />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-6 inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-200 px-5 text-sm font-semibold text-gray-400"
              >
                Select date and time
                <ArrowRight size={17} />
              </button>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Booked slots are automatically
              disabled for the selected date.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default BookingSection;