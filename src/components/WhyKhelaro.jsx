import {
  ShieldCheck,
  Clock3,
  CreditCard,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified turfs",
    description:
      "Find reliable venues with accurate information and trusted listings.",
  },
  {
    icon: Clock3,
    title: "Easy availability",
    description:
      "Check available playing slots before you make your booking.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description:
      "Complete your booking through a secure and convenient payment flow.",
  },
  {
    icon: Headphones,
    title: "Helpful support",
    description:
      "Get assistance when you need help with your booking or account.",
  },
];

const WhyKhelaro = () => {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Why Khelaro
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to get on the field.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
              Khelaro makes turf discovery and booking simpler for
              players while helping turf owners manage their venues
              more efficiently.
            </p>
          </div>

          {/* Features section */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyKhelaro;