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
  ShieldCheck,
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

const getTodayString = () => {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
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

const getDaysInMonth = (year, month) => {
  if (!year || !month) return 31;

  return new Date(
    Number(year),
    Number(month),
    0
  ).getDate();
};

const buildDateString = (year, month, day) => {
  if (!year || !month || !day) return "";

  return `${year}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
};

const convertToMinutes = (time) => {
  if (!time) return -1;

  const value = String(time).trim().toUpperCase();

  const match = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
  );

  if (!match) return -1;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (
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
  const minutes = convertToMinutes(time);

  if (minutes < 0) return "";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(
    2,
    "0"
  )}:${String(mins).padStart(2, "0")}`;
};

const normalizeTime = (time) => {
  if (!time) return "";

  const value = String(time).trim().toUpperCase();

  const match = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
  );

  if (!match) return value;

  const hours = Number(match[1]) % 12 || 12;

  return `${String(hours).padStart(
    2,
    "0"
  )}:${match[2]} ${match[3]}`;
};

const getNextTime = (time) => {
  const totalMinutes = convertToMinutes(time);

  if (totalMinutes < 0) return "";

  const nextMinutes = totalMinutes + 60;
  const hours24 = Math.floor(nextMinutes / 60) % 24;
  const minutes = nextMinutes % 60;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${String(hours12).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(
    2,
    "0"
  )} ${period}`;
};

const getBookingList = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.bookings)) {
    return data.bookings;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const getTurfId = (turf) => {
  return String(
    turf?._id ||
      turf?.id ||
      ""
  ).trim();
};

const getTurfIdentifier = (turf) => {
  return String(
    turf?._id ||
      turf?.id ||
      turf?.slug ||
      ""
  ).trim();
};

const BookingSection = () => {
  const { turfId: routeTurfId, id: routeId } =
    useParams();

  const routeIdentifier = decodeURIComponent(
    String(routeTurfId || routeId || "")
  ).trim();

  const today = useMemo(
    () => getTodayString(),
    []
  );

  const currentYear = Number(
    today.split("-")[0]
  );

  const yearOptions = useMemo(
    () =>
      Array.from(
        { length: 3 },
        (_, index) => currentYear + index
      ),
    [currentYear]
  );

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] =
    useState("");
  const [selectedYear, setSelectedYear] =
    useState("");

  const [selectedSlot, setSelectedSlot] =
    useState("");

  const [bookings, setBookings] = useState([]);

  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);

  const [availabilityError, setAvailabilityError] =
    useState("");

  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTurf = async () => {
      if (!routeIdentifier) {
        setError("Invalid turf ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/turfs`,
          {
            signal: controller.signal,
          }
        );

        const data = await response
          .json()
          .catch(() => []);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load turfs."
          );
        }

        const turfList = Array.isArray(data)
          ? data
          : Array.isArray(data?.turfs)
          ? data.turfs
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const normalizedIdentifier =
          routeIdentifier.toLowerCase();

        const foundTurf = turfList.find(
          (item) => {
            const mongoId = String(
              item?._id || ""
            )
              .trim()
              .toLowerCase();

            const customId = String(
              item?.id || ""
            )
              .trim()
              .toLowerCase();

            const slug = String(
              item?.slug || ""
            )
              .trim()
              .toLowerCase();

            return (
              mongoId === normalizedIdentifier ||
              customId === normalizedIdentifier ||
              slug === normalizedIdentifier
            );
          }
        );

        if (!foundTurf) {
          throw new Error(
            "The selected turf was not found."
          );
        }

        if (!getTurfId(foundTurf)) {
          throw new Error(
            "This turf does not have a valid MongoDB ID."
          );
        }

        setTurf(foundTurf);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error(
          "Failed to load turf:",
          err
        );

        setTurf(null);
        setError(
          err?.message ||
            "Failed to load turf."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTurf();

    return () => controller.abort();
  }, [routeIdentifier]);

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

  const availableDays = useMemo(() => {
    if (
      !selectedYear ||
      !selectedMonth
    ) {
      return 31;
    }

    return getDaysInMonth(
      Number(selectedYear),
      Number(selectedMonth)
    );
  }, [
    selectedYear,
    selectedMonth,
  ]);

  const dayOptions = useMemo(
    () =>
      Array.from(
        { length: availableDays },
        (_, index) => index + 1
      ),
    [availableDays]
  );

  useEffect(() => {
    if (
      !selectedYear ||
      !selectedMonth ||
      !selectedDay
    ) {
      return;
    }

    const maxDays = getDaysInMonth(
      Number(selectedYear),
      Number(selectedMonth)
    );

    if (Number(selectedDay) > maxDays) {
      setSelectedDay(
        String(maxDays).padStart(2, "0")
      );
    }
  }, [
    selectedYear,
    selectedMonth,
    selectedDay,
  ]);

  useEffect(() => {
    setSelectedSlot("");
  }, [selectedDate]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAvailability = async () => {
      if (!turf || !selectedDate) {
        setBookings([]);
        setAvailabilityError("");
        setAvailabilityLoading(false);
        return;
      }

      if (selectedDate < today) {
        setBookings([]);
        setAvailabilityError(
          "Please select today or a future date."
        );
        setAvailabilityLoading(false);
        return;
      }

      const mongoTurfId = getTurfId(turf);

      if (!mongoTurfId) {
        setBookings([]);
        setAvailabilityError(
          "MongoDB turf ID is missing."
        );
        setAvailabilityLoading(false);
        return;
      }

      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");

        const params = new URLSearchParams({
          turfId: mongoTurfId,
          date: selectedDate,
        });

        const response = await fetch(
          `${API_URL}/bookings/availability?${params}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load availability."
          );
        }

        const bookingList =
          getBookingList(data);

        const activeBookings =
          bookingList.filter((booking) => {
            const status = String(
              booking?.status || ""
            ).toLowerCase();

            return (
              status === "pending" ||
              status === "confirmed"
            );
          });

        setBookings(activeBookings);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error(
          "Failed to load availability:",
          err
        );

        setBookings([]);
        setAvailabilityError(
          err?.message ||
            "Failed to load availability."
        );
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      }
    };

    fetchAvailability();

    return () => controller.abort();
  }, [
    turf,
    selectedDate,
    today,
    retryKey,
  ]);

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    setAvailabilityError("");
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setAvailabilityError("");
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setAvailabilityError("");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-[fadeIn_0.4s_ease-out] text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
            <Loader2
              size={28}
              className="animate-spin text-green-600"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading turf...
          </p>
        </div>
      </main>
    );
  }

  if (error || !turf) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="animate-[fadeInUp_0.45s_ease-out] max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle
              size={28}
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

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-gray-800"
            >
              <RefreshCw size={16} />
              Try again
            </button>

            <Link
              to="/turfs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700"
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

  const ratingValue = Number(turf.rating);

  const hasRating =
    turf.rating !== undefined &&
    turf.rating !== null &&
    turf.rating !== "" &&
    Number.isFinite(ratingValue);

  const turfRating = hasRating
    ? ratingValue.toFixed(1)
    : "New";

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

  const isWithinOperatingHours = (
    slot
  ) => {
    const slotStart =
      convertToMinutes(slot);

    if (slotStart < 0) return false;

    const slotEnd = slotStart + 60;

    if (
      openingMinutes < 0 ||
      closingMinutes < 0
    ) {
      return true;
    }

    if (
      closingMinutes > openingMinutes
    ) {
      return (
        slotStart >= openingMinutes &&
        slotEnd <= closingMinutes
      );
    }

    return (
      slotStart >= openingMinutes ||
      slotEnd <= closingMinutes
    );
  };

  const isPastSlot = (slot) => {
    if (!isToday) return false;

    const slotStart =
      convertToMinutes(slot);

    if (slotStart < 0) return true;

    const now = new Date();

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes();

    return slotStart <= currentMinutes;
  };

  const isSlotBooked = (slot) => {
    const slotStart =
      convertToMinutes(slot);

    if (slotStart < 0) return false;

    const slotEnd = slotStart + 60;

    return bookings.some((booking) => {
      const bookingStart =
        convertToMinutes(
          normalizeTime(
            booking?.startTime ||
              booking?.start ||
              ""
          )
        );

      const bookingEnd =
        convertToMinutes(
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
    if (
      !isWithinOperatingHours(slot)
    ) {
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

  const mongoTurfId = getTurfId(turf);

  const bookingUrl = bookingReady
    ? `/booking/${encodeURIComponent(
        mongoTurfId
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

  const availableSlotCount = selectedDate
    ? TIME_SLOTS.filter(
        (slot) =>
          getSlotStatus(slot) ===
          "available"
      ).length
    : 0;

  return (
    <main className="min-h-screen bg-gray-50">
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
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={`/turfs/${encodeURIComponent(
              getTurfIdentifier(turf)
            )}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to turf details
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_430px]">
          {/* Turf information */}
          <div className="animate-[fadeInUp_0.55s_ease-out]">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="group relative h-64 overflow-hidden sm:h-80 lg:h-[390px]">
                <img
                  src={turfImage}
                  alt={turfName}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                <div className="absolute left-5 top-5">
                  <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    {turfSport}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                  <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">
                      Book {turfName}
                    </h1>

                    <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                      <MapPin size={16} />
                      {turfLocation}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-gray-900 shadow-lg backdrop-blur">
                    <Star
                      size={15}
                      className={
                        hasRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />

                    <span className="text-sm font-bold">
                      {turfRating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Booking information
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    Select your preferred date
                    and an available time slot to
                    reserve this turf.
                  </p>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <InfoCard
                    label="Turf size"
                    value={turfSize}
                  />

                  <InfoCard
                    label="Surface"
                    value={turfSurface}
                  />

                  <InfoCard
                    label="Price"
                    value={`৳${turfPrice.toLocaleString(
                      "en-BD"
                    )} / hour`}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-green-100 bg-green-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                      <ShieldCheck size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Easy booking
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Choose a date and available
                        hour. Booked slots are
                        automatically disabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking panel */}
          <aside className="animate-[fadeInUp_0.7s_ease-out] lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              {/* Panel header */}
              <div className="border-b border-gray-100 bg-gradient-to-br from-green-50 to-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white shadow-sm shadow-green-600/20">
                      <CalendarDays size={21} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Select date & time
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Choose your preferred slot
                      </p>
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="animate-[scaleIn_0.25s_ease-out] rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                      {availableSlotCount} available
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* Date */}
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-gray-900">
                    Select date
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <DateSelect
                      value={selectedDay}
                      onChange={handleDayChange}
                      placeholder="Day"
                      options={dayOptions.map(
                        (day) =>
                          String(day).padStart(
                            2,
                            "0"
                          )
                      )}
                    />

                    <DateSelect
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      placeholder="Month"
                      options={MONTHS.map(
                        (month, index) => ({
                          value: String(
                            index + 1
                          ).padStart(2, "0"),
                          label: month,
                        })
                      )}
                    />

                    <DateSelect
                      value={selectedYear}
                      onChange={handleYearChange}
                      placeholder="Year"
                      options={yearOptions.map(
                        (year) =>
                          String(year)
                      )}
                    />
                  </div>

                  {!dateSelectionComplete ? (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-500">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-gray-400"
                      />
                      Select day, month and year.
                    </div>
                  ) : selectedDate ? (
                    <div className="animate-[slideIn_0.25s_ease-out] mt-3 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700">
                      <Check size={16} />
                      {formatDate(selectedDate)}
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-600">
                      <AlertCircle size={15} />
                      Please select a valid date.
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
                <div className="mt-7">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-900">
                      Available time
                    </label>

                    {selectedDate &&
                      !availabilityLoading &&
                      !availabilityError && (
                        <span className="text-[11px] font-medium text-gray-400">
                          1 hour per slot
                        </span>
                      )}
                  </div>

                  {!selectedDate ? (
                    <EmptyState
                      icon={
                        <CalendarDays
                          size={18}
                        />
                      }
                      text="Select a date to check available slots."
                    />
                  ) : availabilityLoading ? (
                    <div className="mt-3 flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 px-4 py-8 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
                        <Loader2
                          size={20}
                          className="animate-spin text-green-600"
                        />
                      </div>

                      <p className="mt-3 text-sm font-medium text-gray-700">
                        Checking availability
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Please wait...
                      </p>
                    </div>
                  ) : availabilityError ? (
                    <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-4">
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
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 transition hover:text-red-700"
                      >
                        <RefreshCw size={13} />
                        Try again
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map(
                          (slot) => {
                            const status =
                              getSlotStatus(
                                slot
                              );

                            const isSelected =
                              selectedSlot ===
                              slot;

                            const disabled =
                              status !==
                              "available";

                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={
                                  disabled
                                }
                                onClick={() =>
                                  setSelectedSlot(
                                    slot
                                  )
                                }
                                className={`
                                  group relative flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold
                                  transition-all duration-200
                                  ${
                                    isSelected
                                      ? "scale-[1.02] border-green-600 bg-green-600 text-white shadow-md shadow-green-600/20"
                                      : status ===
                                        "booked"
                                      ? "cursor-not-allowed border-red-100 bg-red-50 text-red-400"
                                      : status ===
                                        "past"
                                      ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                                      : status ===
                                        "closed"
                                      ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                                      : "border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50 hover:text-green-700 hover:shadow-sm"
                                  }
                                `}
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
                                  <>
                                    <Clock
                                      size={13}
                                    />
                                    {slot}
                                  </>
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4">
                        <Legend
                          dot="bg-green-500"
                          label="Available"
                        />

                        <Legend
                          dot="bg-red-400"
                          label="Booked"
                        />

                        {isToday && (
                          <Legend
                            dot="bg-gray-300"
                            label="Past"
                          />
                        )}

                        <Legend
                          dot="bg-gray-200"
                          label="Closed"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                {bookingReady && (
                  <div className="animate-[fadeInUp_0.3s_ease-out] mt-6 overflow-hidden rounded-2xl border border-green-100 bg-green-50/70">
                    <div className="flex items-center justify-between border-b border-green-100 px-4 py-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Booking summary
                      </h3>

                      <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                        Selected
                      </span>
                    </div>

                    <div className="space-y-3 p-4">
                      <SummaryRow
                        label="Date"
                        value={formatDate(
                          selectedDate
                        )}
                      />

                      <SummaryRow
                        label="Time"
                        value={`${selectedSlot} - ${selectedEndTime}`}
                        icon={<Clock size={14} />}
                      />

                      <div className="border-t border-green-100 pt-3">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-xs text-gray-500">
                              Total price
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900">
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

                {/* CTA */}
                {bookingReady ? (
                  <Link
                    to={bookingUrl}
                    className="group mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Continue to booking
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-5 inline-flex h-13 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-100 px-5 py-3.5 text-sm font-semibold text-gray-400"
                  >
                    Select date and time
                    <ArrowRight size={17} />
                  </button>
                )}

                <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">
                  Booked slots are automatically
                  disabled for your selected date.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

const DateSelect = ({
  value,
  onChange,
  placeholder,
  options,
}) => {
  const normalizedOptions = options.map(
    (option) => {
      if (typeof option === "string") {
        return {
          value: option,
          label: option,
        };
      }

      return option;
    }
  );

  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`h-12 w-full appearance-none rounded-xl border bg-white px-3 pr-8 text-sm outline-none transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 ${
          value
            ? "border-gray-200 text-gray-700"
            : "border-gray-200 text-gray-400"
        }`}
      >
        <option value="">
          {placeholder}
        </option>

        {normalizedOptions.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          )
        )}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
};

const InfoCard = ({
  label,
  value,
}) => (
  <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-100 hover:bg-green-50">
    <p className="text-xs text-gray-400">
      {label}
    </p>

    <p className="mt-1.5 text-sm font-semibold text-gray-900">
      {value}
    </p>
  </div>
);

const EmptyState = ({
  icon,
  text,
}) => (
  <div className="mt-3 flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm text-gray-500">
    <div className="mt-0.5 text-gray-400">
      {icon}
    </div>

    <span className="leading-5">
      {text}
    </span>
  </div>
);

const Legend = ({
  dot,
  label,
}) => (
  <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
    <span
      className={`h-2 w-2 rounded-full ${dot}`}
    />
    {label}
  </span>
);

const SummaryRow = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <span className="flex items-center gap-1.5 text-gray-500">
      {icon}
      {label}
    </span>

    <span className="text-right font-medium text-gray-900">
      {value}
    </span>
  </div>
);

export default BookingSection;