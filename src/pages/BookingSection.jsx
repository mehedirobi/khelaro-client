import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Check,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

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

const BookingSection = ({ turf }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  if (!turf) return null;

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

    let newPeriod = hours >= 12 ? "PM" : "AM";

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

  const bookingReady = selectedDate && selectedSlot;

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
          <CalendarDays size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            Book this turf
          </h2>

          <p className="text-xs text-gray-500">
            Choose your preferred date and time
          </p>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-gray-900">
          Select date
        </label>

        <div className="relative">
          <CalendarDays
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
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
              Select one slot
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

      {/* Booking Summary */}
      {bookingReady && (
        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Booking summary
          </h3>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-500">Date</span>

              <span className="font-medium text-gray-900">
                {new Date(selectedDate).toLocaleDateString("en-BD", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
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

      {/* Book Button */}
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
        Select your preferred date and available time slot to continue.
      </p>
    </aside>
  );
};

export default BookingSection;