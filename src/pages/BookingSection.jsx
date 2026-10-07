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
  ChevronDown,
} from "lucide-react";
import { turfs } from "../data/turfs";

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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getTodayDate = () => {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
};

const getTodayString = () => {
  const { year, month, day } = getTodayDate();

  return `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
};

const formatDate = (date) => {
  if (!date) return "";

  const match = String(date).match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) return date;

  const [, year, month, day] = match;

  return `${day}-${month}-${year}`;
};

const buildDateString = (year, month, day) => {
  if (!year || !month || !day) {
    return "";
  }

  return `${String(year)}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
};

const getDaysInMonth = (year, month) => {
  if (!year || !month) {
    return 31;
  }

  return new Date(
    Number(year),
    Number(month),
    0
  ).getDate();
};

const isDateBeforeToday = (dateString) => {
  if (!dateString) return false;

  return dateString < getTodayString();
};

const convertToMinutes = (time) => {
  if (!time) {
    return -1;
  }

  const value = String(time).trim().toUpperCase();

  const match = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
  );

  if (!match) {
    return -1;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 1 ||
    hours > 12 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return -1;
  }

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

const convertToBackendTime = (time) => {
  const totalMinutes = convertToMinutes(time);

  if (totalMinutes < 0) {
    return "";
  }

  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours24).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
};

const normalizeTime = (time) => {
  if (!time) {
    return "";
  }

  const value = String(time).trim().toUpperCase();

  const match = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
  );

  if (!match) {
    return value;
  }

  const hours = Number(match[1]) % 12 || 12;
  const minutes = match[2];
  const period = match[3];

  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
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
  const { turfId: routeTurfId, id: routeId } = useParams();

  const rawIdentifier = routeTurfId || routeId || "";

  const turfIdentifier = decodeURIComponent(
    String(rawIdentifier)
  ).trim();

  const today = useMemo(() => getTodayString(), []);

  const todayParts = useMemo(() => {
    const [year, month, day] = today.split("-");

    return {
      year,
      month,
      day,
    };
  }, [today]);

  const currentYear = Number(todayParts.year);

  const yearOptions = useMemo(() => {
    return Array.from(
      { length: 3 },
      (_, index) => currentYear + index
    );
  }, [currentYear]);

  const [turf, setTurf] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Keep day, month and year separate.
   * This is important because the user can select
   * them in any order without resetting previous values.
   */
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [selectedSlot, setSelectedSlot] = useState("");

  const [bookings, setBookings] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);
  const [availabilityError, setAvailabilityError] =
    useState("");

  const [retryKey, setRetryKey] = useState(0);

  /*
   * Find turf from local data.
   *
   * Supports:
   * - turf-001
   * - green-field-sports-arena
   */
  useEffect(() => {
    if (!turfIdentifier) {
      setTurf(null);
      setError("Invalid turf ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const decodedIdentifier = turfIdentifier.toLowerCase();

    const foundTurf = turfs.find((item) => {
      const itemId = String(item?.id || "")
        .trim()
        .toLowerCase();

      const itemSlug = String(item?.slug || "")
        .trim()
        .toLowerCase();

      return (
        itemId === decodedIdentifier ||
        itemSlug === decodedIdentifier
      );
    });

    if (!foundTurf) {
      setTurf(null);
      setError("The selected turf was not found.");
      setLoading(false);
      return;
    }

    setTurf(foundTurf);
    setLoading(false);
  }, [turfIdentifier]);

  /*
   * Build complete backend date only when
   * Day + Month + Year are all selected.
   */
  const selectedDate = useMemo(() => {
    if (
      !selectedYear ||
      !selectedMonth ||
      !selectedDay
    ) {
      return "";
    }

    const maxDays = getDaysInMonth(
      Number(selectedYear),
      Number(selectedMonth)
    );

    if (Number(selectedDay) > maxDays) {
      return "";
    }

    return buildDateString(
      selectedYear,
      selectedMonth,
      selectedDay
    );
  }, [
    selectedYear,
    selectedMonth,
    selectedDay,
  ]);

  /*
   * Calculate valid days for selected month/year.
   */
  const availableDays = useMemo(() => {
    if (!selectedYear || !selectedMonth) {
      return 31;
    }

    return getDaysInMonth(
      Number(selectedYear),
      Number(selectedMonth)
    );
  }, [selectedYear, selectedMonth]);

  const dayOptions = useMemo(() => {
    return Array.from(
      { length: availableDays },
      (_, index) => index + 1
    );
  }, [availableDays]);

  /*
   * If current selected day becomes invalid after
   * changing month/year, adjust it automatically.
   *
   * Example:
   * 31 January -> February
   * becomes 28 February.
   */
  useEffect(() => {
    if (!selectedYear || !selectedMonth || !selectedDay) {
      return;
    }

    const maxDays = getDaysInMonth(
      Number(selectedYear),
      Number(selectedMonth)
    );

    if (Number(selectedDay) > maxDays) {
      setSelectedDay(String(maxDays).padStart(2, "0"));
    }
  }, [
    selectedYear,
    selectedMonth,
    selectedDay,
  ]);

  /*
   * Reset selected slot when the complete date changes.
   */
  useEffect(() => {
    setSelectedSlot("");
  }, [selectedDate]);

  /*
   * Load availability only after a complete date
   * has been selected.
   */
  useEffect(() => {
    const controller = new AbortController();

    const fetchAvailability = async () => {
      if (!turf || !selectedDate) {
        setBookings([]);
        setAvailabilityError("");
        setAvailabilityLoading(false);
        return;
      }

      if (isDateBeforeToday(selectedDate)) {
        setBookings([]);
        setAvailabilityError(
          "Please select today or a future date."
        );
        setAvailabilityLoading(false);
        return;
      }

      const backendTurfId = String(
        turf.id || turf._id || ""
      ).trim();

      if (!backendTurfId) {
        setBookings([]);
        setAvailabilityError(
          "Turf ID is missing."
        );
        setAvailabilityLoading(false);
        return;
      }

      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");

        const url =
          `${API_URL}/bookings/availability` +
          `?turfId=${encodeURIComponent(
            backendTurfId
          )}` +
          `&date=${encodeURIComponent(
            selectedDate
          )}`;

        const response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
        });

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load available slots."
          );
        }

        const bookingList = getBookingList(data);

        const activeBookings = bookingList.filter(
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

        setBookings(activeBookings);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(
          "Failed to load booking availability:",
          err
        );

        setBookings([]);

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
  }, [
    turf,
    selectedDate,
    retryKey,
  ]);

  /*
   * Date selection handlers.
   *
   * Important:
   * We NEVER clear the other date fields here.
   */
  const handleDayChange = (event) => {
    const value = event.target.value;

    setSelectedDay(value);
    setAvailabilityError("");
  };

  const handleMonthChange = (event) => {
    const value = event.target.value;

    setSelectedMonth(value);
    setAvailabilityError("");
  };

  const handleYearChange = (event) => {
    const value = event.target.value;

    setSelectedYear(value);
    setAvailabilityError("");
  };

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
    Number.isFinite(priceValue) &&
    priceValue >= 0
      ? priceValue
      : 0;

  const openingTime = normalizeTime(
    turf.openingTime || "08:00 AM"
  );

  const closingTime = normalizeTime(
    turf.closingTime || "11:00 PM"
  );

  const openingMinutes =
    convertToMinutes(openingTime);

  const closingMinutes =
    convertToMinutes(closingTime);

  const isToday = selectedDate === today;

  /*
   * Check turf operating hours.
   */
  const isWithinOperatingHours = (slot) => {
    const slotStart = convertToMinutes(slot);

    if (slotStart < 0) {
      return false;
    }

    const slotEnd = slotStart + 60;

    if (
      openingMinutes < 0 ||
      closingMinutes < 0
    ) {
      return true;
    }

    if (closingMinutes > openingMinutes) {
      return (
        slotStart >= openingMinutes &&
        slotEnd <= closingMinutes
      );
    }

    /*
     * Overnight turf hours.
     * Example: 06:00 PM - 02:00 AM.
     */
    return (
      slotStart >= openingMinutes ||
      slotEnd <= closingMinutes
    );
  };

  /*
   * Disable already-passed slots for today.
   */
  const isPastSlot = (slot) => {
    if (!isToday) {
      return false;
    }

    const slotStart = convertToMinutes(slot);

    if (slotStart < 0) {
      return true;
    }

    const now = new Date();

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes();

    return slotStart <= currentMinutes;
  };

  /*
   * Check existing booking overlap.
   */
  const isSlotBooked = (slot) => {
    const slotStart = convertToMinutes(slot);

    if (slotStart < 0) {
      return false;
    }

    const slotEnd = slotStart + 60;

    return bookings.some((booking) => {
      const bookingStart = convertToMinutes(
        normalizeTime(
          booking?.startTime ||
            booking?.start ||
            ""
        )
      );

      const bookingEnd = convertToMinutes(
        normalizeTime(
          booking?.endTime ||
            booking?.end ||
            ""
        )
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
    if (!isWithinOperatingHours(slot)) {
      return "closed";
    }

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

  const backendStartTime = selectedSlot
    ? convertToBackendTime(selectedSlot)
    : "";

  const backendEndTime = selectedEndTime
    ? convertToBackendTime(selectedEndTime)
    : "";

  const bookingReady = Boolean(
    selectedDate &&
      selectedSlot &&
      backendStartTime &&
      backendEndTime
  );

  /*
   * Use local turf ID.
   * Example: turf-001
   */
  const bookingTurfId = String(
    turf.id || turf._id || turfIdentifier
  ).trim();

  const bookingUrl = bookingReady
    ? `/booking/${encodeURIComponent(
        bookingTurfId
      )}?date=${encodeURIComponent(
        selectedDate
      )}&slot=${encodeURIComponent(
        selectedSlot
      )}`
    : "#";

  const dateSelectionComplete = Boolean(
    selectedDay &&
      selectedMonth &&
      selectedYear
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back navigation */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={`/turfs/${encodeURIComponent(
              turfIdentifier
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
          {/* Turf information */}
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
                  Select your preferred date and
                  available time slot to reserve
                  this turf.
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

          {/* Booking panel */}
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

            {/* Date */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Select date
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* Day */}
                <div className="relative">
                  <select
                    value={selectedDay}
                    onChange={handleDayChange}
                    className={`h-12 w-full appearance-none rounded-xl border bg-white px-3 pr-8 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 ${
                      selectedDay
                        ? "border-gray-200 text-gray-700"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    <option value="">
                      Day
                    </option>

                    {dayOptions.map((day) => {
                      const value = String(
                        day
                      ).padStart(2, "0");

                      return (
                        <option
                          key={value}
                          value={value}
                        >
                          {value}
                        </option>
                      );
                    })}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                {/* Month */}
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className={`h-12 w-full appearance-none rounded-xl border bg-white px-3 pr-8 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 ${
                      selectedMonth
                        ? "border-gray-200 text-gray-700"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    <option value="">
                      Month
                    </option>

                    {MONTHS.map(
                      (month, index) => {
                        const value =
                          String(index + 1).padStart(
                            2,
                            "0"
                          );

                        return (
                          <option
                            key={value}
                            value={value}
                          >
                            {month}
                          </option>
                        );
                      }
                    )}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                {/* Year */}
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className={`h-12 w-full appearance-none rounded-xl border bg-white px-3 pr-8 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 ${
                      selectedYear
                        ? "border-gray-200 text-gray-700"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    <option value="">
                      Year
                    </option>

                    {yearOptions.map(
                      (year) => (
                        <option
                          key={year}
                          value={String(year)}
                        >
                          {year}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Date status */}
              {!dateSelectionComplete ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-xs leading-5 text-gray-500">
                  <CalendarDays
                    size={15}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <span>
                    Select day, month and year.
                  </span>
                </div>
              ) : selectedDate ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700">
                  <CalendarDays size={16} />
                  {formatDate(selectedDate)}
                </div>
              ) : (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-600">
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    Please select a valid date.
                  </span>
                </div>
              )}

              {availabilityError &&
                !availabilityLoading && (
                  <p className="mt-2 text-xs text-red-500">
                    {availabilityError}
                  </p>
                )}
            </div>

            {/* Time slots */}
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
                    Select day, month and year to
                    check available slots.
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
                    onClick={() =>
                      setRetryKey(
                        (current) =>
                          current + 1
                      )
                    }
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
                            setSelectedSlot(slot)
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
                              : status ===
                                "closed"
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
                          ) : status ===
                            "closed" ? (
                            <span className="text-[10px]">
                              Closed
                            </span>
                          ) : status ===
                            "past" ? (
                            <span className="text-[10px]">
                              Past
                            </span>
                          ) : (
                            <Clock size={13} />
                          )}

                          {status !==
                            "booked" &&
                            status !==
                              "closed" &&
                            status !==
                              "past" &&
                            slot}
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

                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-gray-200" />
                      Closed
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Booking summary */}
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
                      {formatDate(selectedDate)}
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
                          Turf price
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

            {/* Continue */}
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