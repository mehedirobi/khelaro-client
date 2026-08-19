import { useState } from "react";
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
} from "lucide-react";
import { turfs } from "../data/turfs";

const timeSlots = [
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

const BookingSection = () => {
  const { id } = useParams();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  // Find turf from URL id
  const turf = turfs.find((item) => item.id === id);

  // If turf doesn't exist
  if (!turf) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Turf not found
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            The turf you are trying to book does not exist.
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

  const getNextTime = (time) => {
    const [timeValue, period] = time.split(" ");

    let [hours, minutes] = timeValue.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    hours += 1;

    const newPeriod = hours >= 12 ? "PM" : "AM";

    if (hours > 12) {
      hours -= 12;
    }

    if (hours === 0) {
      hours = 12;
    }

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")} ${newPeriod}`;
  };

  const selectedEndTime = selectedSlot
    ? getNextTime(selectedSlot)
    : "";

  const bookingReady = Boolean(selectedDate && selectedSlot);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={`/turfs/${turf.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft size={16} />
            Back to turf details
          </Link>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Turf Information */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="relative h-64 sm:h-80">
                <img
                  src={turf.image}
                  alt={turf.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800">
                    {turf.sport}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      Book {turf.name}
                    </h1>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin
                        size={17}
                        className="text-green-600"
                      />
                      {turf.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-sm font-semibold text-amber-700">
                      {turf.rating}
                    </span>
                  </div>
                </div>

                <div className="my-7 h-px bg-gray-100" />

                <h2 className="text-lg font-semibold text-gray-900">
                  Booking information
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  Select your preferred date and time slot to
                  reserve this turf.
                </p>

                {/* Turf Details */}
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Turf size
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {turf.size}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Surface
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {turf.surface}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">
                      Price
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      ৳{turf.price.toLocaleString()} / hour
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
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
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot("");
                  }}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                />
              </div>
            </div>

            {/* Time Slots */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">
                  Available time slots
                </label>

                {selectedDate && (
                  <span className="text-xs text-green-600">
                    Select one
                  </span>
                )}
              </div>

              {!selectedDate ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-4 text-sm text-gray-500">
                  <AlertCircle size={17} />
                  Select a date to see available slots.
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-medium transition ${
                          isSelected
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {isSelected && <Check size={14} />}
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Summary */}
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
                      {new Date(
                        `${selectedDate}T00:00:00`
                      ).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Clock size={15} />
                      Time
                    </span>

                    <span className="font-medium text-gray-900">
                      {selectedSlot} - {selectedEndTime}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500">
                          Total price
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          ৳{turf.price.toLocaleString()}
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
                to={`/booking/${turf.id}?date=${selectedDate}&slot=${encodeURIComponent(
                  selectedSlot
                )}`}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700"
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
              Select a date and available time slot to continue.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default BookingSection;