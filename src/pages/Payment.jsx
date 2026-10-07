import { useEffect, useState } from "react";
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
  },
  {
    id: "nagad",
    name: "Nagad",
    description: "Pay using your Nagad account",
    icon: Wallet,
  },
  {
    id: "card",
    name: "Debit / Credit Card",
    description: "Visa, Mastercard and other supported cards",
    icon: CreditCard,
  },
];

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

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
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

  const hours = Number(match[1]) % 12 || 12;
  const minutes = match[2];
  const period = match[3];

  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
};

const Payment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const date = searchParams.get("date");
  const slot = searchParams.get("slot");

  const { currentUser, loading: authLoading } = useAuth();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [selectedMethod, setSelectedMethod] = useState("bkash");

  const [accountNumber, setAccountNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchTurf = async () => {
      const turfId = decodeURIComponent(
        String(id || "")
      ).trim();

      if (!turfId) {
        setError("Invalid turf ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/turfs/${encodeURIComponent(turfId)}`,
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
            "Invalid turf data received."
          );
        }

        setTurf(turfData);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

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

    return () => {
      controller.abort();
    };
  }, [id]);

  const validatePaymentDetails = () => {
    if (selectedMethod === "bkash") {
      if (!/^01\d{9}$/.test(accountNumber)) {
        return "Enter a valid 11-digit bKash number.";
      }
    }

    if (selectedMethod === "nagad") {
      if (!/^01\d{9}$/.test(accountNumber)) {
        return "Enter a valid 11-digit Nagad number.";
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

  const handlePayment = async () => {
    if (paying) {
      return;
    }

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
        "Please login to your Khelaro account before completing the booking payment."
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

    if (
      !startTime ||
      !endTime ||
      convertToMinutes(startTime) < 0 ||
      convertToMinutes(endTime) < 0
    ) {
      setPaymentError(
        "Invalid booking time slot. Please go back and select the time again."
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
      setPaymentError(
        "Turf ID is missing."
      );
      return;
    }

    try {
      setPaying(true);
      setPaymentError("");

      const response = await fetch(
        `${API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            turfId,
            userEmail,

            date,
            startTime,
            endTime,

            paymentMethod: selectedMethod,
            paymentStatus: "paid",
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to create booking."
        );
      }

      const booking =
        data?.booking ||
        data?.data;

      if (
        !booking ||
        typeof booking !== "object"
      ) {
        throw new Error(
          "Booking was created but no booking information was returned."
        );
      }

      const bookingId = String(
        booking._id ||
          booking.id ||
          booking.bookingId ||
          ""
      ).trim();

      if (!bookingId) {
        throw new Error(
          "Booking ID was not returned by the server."
        );
      }

      navigate(
        `/booking-success/${encodeURIComponent(
          turfId
        )}?date=${encodeURIComponent(
          date
        )}&slot=${encodeURIComponent(
          `${startTime} - ${endTime}`
        )}&method=${encodeURIComponent(
          selectedMethod
        )}&bookingId=${encodeURIComponent(
          bookingId
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

  if (loading || authLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2
            size={22}
            className="animate-spin text-green-600"
          />

          {loading
            ? "Loading payment..."
            : "Checking login status..."}
        </div>
      </main>
    );
  }

  if (!turf || !date || !slot) {
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
            Payment information missing
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "Please complete your booking details before proceeding to payment."}
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

  const turfId = String(
    turf._id ||
      turf.id ||
      turf.turfId ||
      id ||
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

  const turfPriceValue = Number(turf.price);

  const turfPrice =
    Number.isFinite(turfPriceValue) &&
    turfPriceValue >= 0
      ? turfPriceValue
      : 0;

  const formattedDate = new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    "en-BD",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const normalizedStartTime =
    normalizeTime(slot);

  const normalizedEndTime =
    getNextTime(normalizedStartTime);

  const displaySlot =
    normalizedStartTime && normalizedEndTime
      ? `${normalizedStartTime} - ${normalizedEndTime}`
      : slot;

  const serviceFee = 50;
  const totalPrice =
    turfPrice + serviceFee;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={`/booking/${encodeURIComponent(
              turfId
            )}?date=${encodeURIComponent(
              date
            )}&slot=${encodeURIComponent(
              slot
            )}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft size={17} />
            Back to booking
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <ShieldCheck size={15} />
            Secure payment
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Complete your payment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Choose your preferred payment
            method to confirm your booking.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment method
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select how you would like to pay.
              </p>

              <div className="mt-6 space-y-3">
                {paymentMethods.map(
                  (method) => {
                    const Icon =
                      method.icon;

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
                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                        } ${
                          paying
                            ? "cursor-not-allowed opacity-70"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                              isSelected
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon size={21} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {method.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {method.description}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check size={13} />
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment details
              </h2>

              {selectedMethod === "bkash" && (
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    bKash account number
                  </label>

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
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Enter the mobile number connected
                    to your bKash account.
                  </p>
                </div>
              )}

              {selectedMethod === "nagad" && (
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Nagad account number
                  </label>

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
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Enter the mobile number connected
                    to your Nagad account.
                  </p>
                </div>
              )}

              {selectedMethod === "card" && (
                <div className="mt-6 grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      Card number
                    </label>

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

                        const formatted =
                          value.replace(
                            /(\d{4})(?=\d)/g,
                            "$1 "
                          );

                        setCardNumber(
                          formatted
                        );
                      }}
                      placeholder="1234 5678 9012 3456"
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
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

                          if (value.length > 2) {
                            setExpiry(
                              `${value.slice(
                                0,
                                2
                              )} / ${value.slice(2)}`
                            );
                          } else {
                            setExpiry(value);
                          }
                        }}
                        placeholder="MM / YY"
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
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
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {paymentError && (
              <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-5">
                <AlertCircle
                  size={20}
                  className="shrink-0 text-red-500"
                />

                <div>
                  <h3 className="text-sm font-semibold text-red-800">
                    Payment failed
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-red-600">
                    {paymentError}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
              <LockKeyhole
                size={20}
                className="shrink-0 text-green-600"
              />

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Your payment is secure
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Your booking information is securely
                  submitted to the Khelaro server.
                </p>
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Booking summary
              </h2>

              <div className="mt-5 overflow-hidden rounded-xl">
                <img
                  src={turfImage}
                  alt={turfName}
                  className="h-36 w-full object-cover"
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
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-900">
                  {turfName}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={15} />
                  {turfLocation}
                </div>
              </div>

              <div className="my-5 border-t border-gray-100" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <CalendarDays
                    size={17}
                    className="text-green-600"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Date
                    </p>

                    <p className="font-medium text-gray-900">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock
                    size={17}
                    className="text-green-600"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Time slot
                    </p>

                    <p className="font-medium text-gray-900">
                      {displaySlot}
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-5 border-t border-gray-100" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Turf booking
                  </span>

                  <span className="font-medium text-gray-900">
                    ৳
                    {turfPrice.toLocaleString(
                      "en-BD"
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Service fee
                  </span>

                  <span className="font-medium text-gray-900">
                    ৳{serviceFee}
                  </span>
                </div>

                <div className="flex justify-between border-t border-gray-100 pt-4">
                  <span className="font-semibold text-gray-900">
                    Total amount
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    ৳
                    {totalPrice.toLocaleString(
                      "en-BD"
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={paying || authLoading}
                onClick={handlePayment}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paying ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <LockKeyhole size={17} />
                    Pay ৳
                    {totalPrice.toLocaleString(
                      "en-BD"
                    )}
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                By continuing, you agree to our
                booking and cancellation policy.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Payment;