import { useEffect, useState } from "react";
import {
  Link,
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
    description:
      "Visa, Mastercard and other supported cards",
    icon: CreditCard,
  },
];

const Payment = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const date = searchParams.get("date");
  const slot = searchParams.get("slot");

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMethod, setSelectedMethod] =
    useState("bkash");

  useEffect(() => {
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
          `${API_URL}/turfs/${encodeURIComponent(turfId)}`
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load turf."
          );
        }

        const turfData =
          data?.turf || data?.data || data;

        if (!turfData || typeof turfData !== "object") {
          throw new Error("Invalid turf data received.");
        }

        setTurf(turfData);
      } catch (error) {
        console.error(
          "Failed to load turf:",
          error
        );

        setTurf(null);
        setError(
          error?.message || "Failed to load turf."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTurf();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2
            size={22}
            className="animate-spin text-green-600"
          />
          Loading payment...
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
    turf._id || turf.id || ""
  );

  const turfName = turf.name || "Unnamed Turf";

  const turfImage =
    typeof turf.image === "string" && turf.image.trim()
      ? turf.image
      : FALLBACK_IMAGE;

  const turfLocation =
    turf.location ||
    turf.area ||
    "Dhaka, Bangladesh";

  const turfPrice = Number(turf.price) || 0;

  const formattedDate = new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-BD", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const serviceFee = 50;
  const totalPrice = turfPrice + serviceFee;

  const selectedPayment = paymentMethods.find(
    (method) => method.id === selectedMethod
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={`/booking/${encodeURIComponent(
              turfId
            )}?date=${encodeURIComponent(
              date
            )}&slot=${encodeURIComponent(slot)}`}
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
            Choose your preferred payment method to confirm
            your booking.
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
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected =
                    selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setSelectedMethod(method.id)
                      }
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
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
                })}
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
                    placeholder="01XXXXXXXXX"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Enter the mobile number connected to
                    your bKash account.
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
                    placeholder="01XXXXXXXXX"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Enter the mobile number connected to
                    your Nagad account.
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
                      placeholder="1234 5678 9012 3456"
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        Expiry date
                      </label>

                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        CVV
                      </label>

                      <input
                        type="password"
                        placeholder="123"
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                  This is currently a frontend demonstration.
                  No real payment will be processed.
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
                    event.currentTarget.src =
                      FALLBACK_IMAGE;
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
                      {slot}
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
                    ৳{turfPrice.toLocaleString("en-BD")}
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
                    ৳{totalPrice.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>

              <Link
                to={`/booking-success/${encodeURIComponent(
                  turfId
                )}?date=${encodeURIComponent(
                  date
                )}&slot=${encodeURIComponent(
                  slot
                )}&method=${encodeURIComponent(
                  selectedPayment.id
                )}`}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <LockKeyhole size={17} />
                Pay ৳{totalPrice.toLocaleString("en-BD")}
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                By continuing, you agree to our booking and
                cancellation policy.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Payment;