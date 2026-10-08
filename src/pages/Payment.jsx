import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  CreditCard,
  Wallet,
  Check,
  ShieldCheck,
  LockKeyhole,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://placehold.co/1200x800?text=No+Turf+Image";

const paymentMethods = [
  {
    id: "bkash",
    name: "bKash",
    description: "Pay securely with your bKash account",
    icon: Wallet,
    color: "rose",
  },
  {
    id: "nagad",
    name: "Nagad",
    description: "Pay using your Nagad account",
    icon: Wallet,
    color: "orange",
  },
  {
    id: "card",
    name: "Debit / Credit Card",
    description: "Visa, Mastercard and supported cards",
    icon: CreditCard,
    color: "blue",
  },
];

const convertToMinutes = (time) => {
  if (!time) return -1;

  const value = String(time).trim().toUpperCase();

  const match24 = value.match(
    /^([01]\d|2[0-3]):([0-5]\d)$/
  );

  if (match24) {
    return (
      Number(match24[1]) * 60 +
      Number(match24[2])
    );
  }

  const match12 = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
  );

  if (!match12) return -1;

  let hours = Number(match12[1]);
  const minutes = Number(match12[2]);
  const period = match12[3];

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

const format24HourTime = (minutes) => {
  if (
    !Number.isFinite(minutes) ||
    minutes < 0 ||
    minutes >= 1440
  ) {
    return "";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    mins
  ).padStart(2, "0")}`;
};

const formatDisplayTime = (time) => {
  const totalMinutes = convertToMinutes(time);

  if (totalMinutes < 0) return "";

  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${String(hours12).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")} ${period}`;
};

const normalizeTime = (time) => {
  const minutes = convertToMinutes(time);

  if (minutes < 0) return "";

  return format24HourTime(minutes);
};

const getNextTime = (time) => {
  const minutes = convertToMinutes(time);

  if (minutes < 0) return "";

  const nextMinutes = minutes + 60;

  if (nextMinutes >= 1440) return "";

  return format24HourTime(nextMinutes);
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

const getTurfFromResponse = (data) => {
  if (data?.turf) return data.turf;

  if (data?.data && !Array.isArray(data.data)) {
    return data.data;
  }

  if (data?.result) return data.result;

  return null;
};

const Payment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const date = searchParams.get("date")?.trim() || "";
  const slot = searchParams.get("slot")?.trim() || "";

  const { currentUser, loading: authLoading } =
    useAuth();

  const [turf, setTurf] = useState(null);

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [error, setError] = useState("");
  const [paymentError, setPaymentError] =
    useState("");

  const [selectedMethod, setSelectedMethod] =
    useState("bkash");

  const [accountNumber, setAccountNumber] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadTurf = async () => {
      const turfIdentifier = decodeURIComponent(
        String(id || "")
      ).trim();

      if (!turfIdentifier) {
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
          )}`
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Unable to load turf."
          );
        }

        const foundTurf =
          getTurfFromResponse(data);

        if (!foundTurf) {
          throw new Error("Turf not found.");
        }

        if (!cancelled) {
          setTurf(foundTurf);
        }
      } catch (err) {
        console.error("Turf loading error:", err);

        if (!cancelled) {
          setTurf(null);
          setError(
            err?.message ||
              "Failed to load turf information."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTurf();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const validatePaymentDetails = () => {
    if (
      selectedMethod === "bkash" ||
      selectedMethod === "nagad"
    ) {
      if (!/^01\d{9}$/.test(accountNumber)) {
        return `Enter a valid 11-digit ${
          selectedMethod === "bkash"
            ? "bKash"
            : "Nagad"
        } number.`;
      }
    }

    if (selectedMethod === "card") {
      const cleanCardNumber =
        cardNumber.replace(/\s/g, "");

      if (!/^\d{16}$/.test(cleanCardNumber)) {
        return "Enter a valid 16-digit card number.";
      }

      if (!/^\d{2}\s?\/\s?\d{2}$/.test(expiry)) {
        return "Enter a valid expiry date.";
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        return "Enter a valid CVV.";
      }
    }

    return "";
  };

  const checkAvailability = async ({
    turfId,
    selectedDate,
  }) => {
    const url =
      `${API_URL}/bookings/availability` +
      `?turfId=${encodeURIComponent(turfId)}` +
      `&date=${encodeURIComponent(selectedDate)}`;

    const response = await fetch(url);

    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Could not check slot availability."
      );
    }

    return getBookingList(data);
  };

  const isSlotAlreadyBooked = (
    bookingList,
    startTime,
    endTime
  ) => {
    const requestedStart =
      convertToMinutes(startTime);

    const requestedEnd =
      convertToMinutes(endTime);

    if (
      requestedStart < 0 ||
      requestedEnd < 0
    ) {
      return false;
    }

    return bookingList.some((booking) => {
      const status = String(
        booking?.status || ""
      ).toLowerCase();

      if (
        status !== "pending" &&
        status !== "confirmed"
      ) {
        return false;
      }

      const bookingStart =
        convertToMinutes(
          booking?.startTime ||
            booking?.start ||
            ""
        );

      const bookingEnd =
        convertToMinutes(
          booking?.endTime ||
            booking?.end ||
            ""
        );

      if (
        bookingStart < 0 ||
        bookingEnd < 0
      ) {
        return false;
      }

      return (
        requestedStart < bookingEnd &&
        requestedEnd > bookingStart
      );
    });
  };

  const handlePayment = async () => {
    if (paying) return;

    setPaymentError("");

    if (authLoading) {
      setPaymentError(
        "Checking your login status. Please try again."
      );
      return;
    }

    if (!turf || !date || !slot) {
      setPaymentError(
        "Booking information is incomplete."
      );
      return;
    }

    const userEmail = currentUser?.email
      ?.trim()
      .toLowerCase();

    if (!userEmail) {
      setPaymentError(
        "Please login before completing your booking."
      );
      return;
    }

    const validationError =
      validatePaymentDetails();

    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    const startTime = normalizeTime(slot);
    const endTime = getNextTime(startTime);

    if (!startTime || !endTime) {
      setPaymentError(
        "Invalid booking time slot. Please select the time again."
      );
      return;
    }

    const startMinutes =
      convertToMinutes(startTime);

    const endMinutes =
      convertToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      setPaymentError(
        "Invalid booking time slot."
      );
      return;
    }

    const turfId = String(
      turf?._id ||
        turf?.id ||
        turf?.turfId ||
        id ||
        ""
    ).trim();

    if (!turfId) {
      setPaymentError("Turf ID is missing.");
      return;
    }

    const turfName = String(
      turf?.name || "Unnamed Turf"
    ).trim();

    const turfLocation = String(
      turf?.location ||
        turf?.area ||
        "Dhaka, Bangladesh"
    ).trim();

    const turfImage =
      typeof turf?.image === "string"
        ? turf.image.trim()
        : "";

    try {
      setPaying(true);

      const bookingList =
        await checkAvailability({
          turfId,
          selectedDate: date,
        });

      const alreadyBooked =
        isSlotAlreadyBooked(
          bookingList,
          startTime,
          endTime
        );

      if (alreadyBooked) {
        setPaymentError(
          `This slot is no longer available. ${formatDisplayTime(
            startTime
          )} - ${formatDisplayTime(
            endTime
          )} is already booked.`
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            turfId,
            turfName,
            turfLocation,
            turfImage,

            userEmail,

            userName:
              currentUser?.displayName ||
              currentUser?.name ||
              "",

            date,
            startTime,
            endTime,

            price: Number(turf?.price) || 0,

            paymentMethod: selectedMethod,
            paymentStatus: "paid",
            status: "confirmed",
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        const serverMessage = String(
          data?.message ||
            data?.error ||
            "Failed to create booking."
        );

        if (
          response.status === 409 ||
          serverMessage
            .toLowerCase()
            .includes("already booked") ||
          serverMessage
            .toLowerCase()
            .includes("already booking")
        ) {
          throw new Error(
            "This slot was just booked by another user. Please choose another slot."
          );
        }

        throw new Error(serverMessage);
      }

      const booking =
        data?.booking ||
        data?.data ||
        data?.result;

      if (
        !booking ||
        typeof booking !== "object"
      ) {
        throw new Error(
          "Booking was created but no booking information was returned."
        );
      }

      const bookingId = String(
        booking?._id ||
          booking?.id ||
          booking?.bookingId ||
          ""
      ).trim();

      if (!bookingId) {
        throw new Error(
          "Booking ID was not returned by the server."
        );
      }

      const displayStart =
        formatDisplayTime(startTime);

      const displayEnd =
        formatDisplayTime(endTime);

      navigate(
        `/booking-success/${encodeURIComponent(
          turfId
        )}?date=${encodeURIComponent(
          date
        )}&slot=${encodeURIComponent(
          `${displayStart} - ${displayEnd}`
        )}&method=${encodeURIComponent(
          selectedMethod
        )}&bookingId=${encodeURIComponent(
          bookingId
        )}&amount=${encodeURIComponent(
          Number(turf?.price) || 0
        )}`,
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "Payment/booking error:",
        err
      );

      setPaymentError(
        err?.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setPaying(false);
    }
  };

  const turfId = useMemo(
    () =>
      String(
        turf?._id ||
          turf?.id ||
          turf?.turfId ||
          id ||
          ""
      ).trim(),
    [turf, id]
  );

  const turfName = String(
    turf?.name || "Unnamed Turf"
  ).trim();

  const turfImage =
    typeof turf?.image === "string" &&
    turf.image.trim()
      ? turf.image.trim()
      : FALLBACK_IMAGE;

  const turfLocation = String(
    turf?.location ||
      turf?.area ||
      "Dhaka, Bangladesh"
  ).trim();

  const turfPrice = useMemo(() => {
    const price = Number(turf?.price);

    return Number.isFinite(price) && price >= 0
      ? price
      : 0;
  }, [turf?.price]);

  const formattedDate = useMemo(() => {
    if (!date) return "Not available";

    const parsed = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-BD", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [date]);

  const normalizedStartTime =
    normalizeTime(slot);

  const normalizedEndTime =
    getNextTime(normalizedStartTime);

  const displaySlot =
    normalizedStartTime &&
    normalizedEndTime
      ? `${formatDisplayTime(
          normalizedStartTime
        )} - ${formatDisplayTime(
          normalizedEndTime
        )}`
      : slot;

  const serviceFee = 50;
  const totalPrice = turfPrice + serviceFee;

  if (loading || authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-3xl bg-green-100 opacity-50" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-green-100">
              <Loader2
                size={28}
                className="animate-spin text-green-600"
              />
            </div>
          </div>

          <h1 className="mt-6 text-xl font-bold text-gray-900">
            {loading
              ? "Preparing checkout"
              : "Checking your account"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {loading
              ? "Loading your turf and booking information..."
              : "Verifying your login status..."}
          </p>

          <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-[paymentLoading_1.4s_ease-in-out_infinite] rounded-full bg-green-500" />
          </div>
        </div>
      </main>
    );
  }

  if (!turf || !date || !slot) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-5 text-center duration-500">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50">
            <AlertCircle
              size={32}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Payment information unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "Please complete your booking information before continuing."}
          </p>

          <Link
            to="/turfs"
            className="group mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Turfs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to={`/booking/${encodeURIComponent(
              turfId
            )}?date=${encodeURIComponent(
              date
            )}&slot=${encodeURIComponent(
              slot
            )}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition duration-200 hover:text-green-600"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to booking
          </Link>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Heading */}
        <div className="animate-in fade-in slide-in-from-bottom-3 mb-8 duration-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              <ShieldCheck size={15} />
              Secure checkout
            </span>

            <span className="text-xs font-medium text-gray-400">
              Step 2 of 2
            </span>
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Complete your payment
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Choose your preferred payment method
                and confirm your turf booking.
              </p>
            </div>

            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600 sm:flex">
              <Sparkles size={21} />
            </div>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Payment method */}
            <section className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm duration-500 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-600">
                  Step 1
                </p>

                <h2 className="mt-1 text-lg font-bold text-gray-900">
                  Payment method
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select how you would like to pay.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                {paymentMethods.map(
                  (method, index) => {
                    const Icon = method.icon;

                    const isSelected =
                      selectedMethod ===
                      method.id;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        disabled={paying}
                        onClick={() => {
                          setSelectedMethod(
                            method.id
                          );
                          setPaymentError("");
                          setAccountNumber("");
                          setCardNumber("");
                          setExpiry("");
                          setCvv("");
                        }}
                        style={{
                          animationDelay: `${
                            index * 70
                          }ms`,
                        }}
                        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                          isSelected
                            ? "border-green-500 bg-green-50/70 shadow-sm"
                            : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm"
                        } ${
                          paying
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute inset-y-0 left-0 w-1 rounded-full bg-green-500" />
                        )}

                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                              isSelected
                                ? "scale-105 bg-green-600 text-white shadow-md shadow-green-600/20"
                                : "bg-gray-100 text-gray-600 group-hover:bg-green-50 group-hover:text-green-600"
                            }`}
                          >
                            <Icon size={21} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                              {method.name}
                            </p>

                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {method.description}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            isSelected
                              ? "scale-110 border-green-600 bg-green-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <Check
                              size={14}
                              className="animate-in zoom-in duration-200"
                            />
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </section>

            {/* Payment details */}
            <section className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm duration-700 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-600">
                Step 2
              </p>

              <h2 className="mt-1 text-lg font-bold text-gray-900">
                Payment details
              </h2>

              <div
                key={selectedMethod}
                className="animate-in fade-in slide-in-from-right-3 duration-300"
              >
                {(selectedMethod === "bkash" ||
                  selectedMethod === "nagad") && (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      {selectedMethod ===
                      "bkash"
                        ? "bKash"
                        : "Nagad"}{" "}
                      account number
                    </label>

                    <div className="relative">
                      <Wallet
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                        value={accountNumber}
                        disabled={paying}
                        onChange={(event) =>
                          setAccountNumber(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 11)
                          )
                        }
                        placeholder="01XXXXXXXXX"
                        className="h-13 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition duration-200 placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                      />
                    </div>

                    <div className="mt-3 flex items-start gap-2 rounded-xl bg-gray-50 p-3">
                      <ShieldCheck
                        size={15}
                        className="mt-0.5 shrink-0 text-green-600"
                      />

                      <p className="text-xs leading-5 text-gray-500">
                        Enter the mobile number connected
                        to your{" "}
                        {selectedMethod === "bkash"
                          ? "bKash"
                          : "Nagad"}{" "}
                        account.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === "card" && (
                  <div className="mt-6 grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-900">
                        Card number
                      </label>

                      <div className="relative">
                        <CreditCard
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={19}
                          value={cardNumber}
                          disabled={paying}
                          onChange={(event) => {
                            const value =
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 16);

                            setCardNumber(
                              value.replace(
                                /(\d{4})(?=\d)/g,
                                "$1 "
                              )
                            );
                          }}
                          placeholder="1234 5678 9012 3456"
                          className="h-13 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm tracking-wide outline-none transition duration-200 placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                          Expiry date
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={7}
                          value={expiry}
                          disabled={paying}
                          onChange={(event) => {
                            const value =
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4);

                            setExpiry(
                              value.length > 2
                                ? `${value.slice(
                                    0,
                                    2
                                  )} / ${value.slice(
                                    2
                                  )}`
                                : value
                            );
                          }}
                          placeholder="MM / YY"
                          className="h-13 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition duration-200 placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                          CVV
                        </label>

                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={cvv}
                          disabled={paying}
                          onChange={(event) =>
                            setCvv(
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4)
                            )
                          }
                          placeholder="123"
                          className="h-13 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm tracking-widest outline-none transition duration-200 placeholder:tracking-normal placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Error */}
            {paymentError && (
              <div className="animate-in fade-in slide-in-from-bottom-3 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 duration-300">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <AlertCircle
                    size={19}
                    className="text-red-500"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-red-800">
                    Booking could not be completed
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-red-600">
                    {paymentError}
                  </p>

                  {paymentError
                    .toLowerCase()
                    .includes("booked") && (
                    <Link
                      to={`/booking/${encodeURIComponent(
                        turfId
                      )}?date=${encodeURIComponent(
                        date
                      )}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-700 transition hover:text-red-900"
                    >
                      <RefreshCw size={13} />
                      Choose another slot
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Security */}
            <div className="animate-in fade-in rounded-2xl border border-green-100 bg-green-50 p-5 duration-700">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                  <LockKeyhole size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Your payment is secure
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Your booking information is securely
                    submitted to the Khelaro server.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside>
            <div className="animate-in fade-in slide-in-from-right-5 sticky top-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm duration-700 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-600">
                    Order
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    Booking summary
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Check size={18} />
                </div>
              </div>

              {/* Turf image */}
              <div className="group relative mt-5 overflow-hidden rounded-2xl">
                <img
                  src={turfImage}
                  alt={turfName}
                  className="h-44 w-full object-cover transition duration-700 group-hover:scale-105"
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur">
                  {turf?.sport || "Sports Turf"}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {turfName}
                </h3>

                <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                  <MapPin
                    size={15}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <span>{turfLocation}</span>
                </div>
              </div>

              <div className="my-5 h-px bg-gray-100" />

              {/* Booking info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                    <CalendarDays size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Date
                    </p>

                    <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                    <Clock size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Time slot
                    </p>

                    <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                      {displaySlot}
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-5 h-px bg-gray-100" />

              {/* Price */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Turf booking
                  </span>

                  <span className="font-semibold text-gray-900">
                    ৳
                    {turfPrice.toLocaleString(
                      "en-BD"
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    Service fee
                  </span>

                  <span className="font-semibold text-gray-900">
                    ৳
                    {serviceFee.toLocaleString(
                      "en-BD"
                    )}
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Total amount
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Including service fee
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-green-600">
                    ৳
                    {totalPrice.toLocaleString(
                      "en-BD"
                    )}
                  </span>
                </div>
              </div>

              {/* Pay */}
              <button
                type="button"
                disabled={
                  paying || authLoading
                }
                onClick={handlePayment}
                className="group relative mt-7 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-green-600 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {!paying && (
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}

                {paying ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Processing booking...
                  </>
                ) : (
                  <>
                    <LockKeyhole
                      size={17}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />

                    <span>
                      Pay ৳
                      {totalPrice.toLocaleString(
                        "en-BD"
                      )}
                    </span>

                    <ChevronRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                <ShieldCheck
                  size={14}
                  className="text-green-500"
                />
                Secure Khelaro checkout
              </div>

              <p className="mt-3 text-center text-[11px] leading-5 text-gray-400">
                By continuing, you agree to our booking
                and cancellation policy.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Custom animation */}
      <style>{`
        @keyframes paymentLoading {
          0% {
            transform: translateX(-100%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </main>
  );
};

export default Payment;