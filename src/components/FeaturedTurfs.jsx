import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TurfCard from "./TurfCard";

const featuredTurfs = [
  {
    id: "turf-1",
    name: "Arena Sports Zone",
    location: "Mirpur, Dhaka",
    sport: "Football",
    rating: "4.8",
    price: "1,200",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "turf-2",
    name: "Uttara Sports Arena",
    location: "Uttara, Dhaka",
    sport: "Football",
    rating: "4.7",
    price: "1,500",
    image:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "turf-3",
    name: "Playground 360",
    location: "Mohammadpur, Dhaka",
    sport: "Football",
    rating: "4.9",
    price: "1,300",
    image:
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80",
  },
];

const FeaturedTurfs = () => {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Featured venues
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Popular turfs to play
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Discover some of the most popular places to play around
              Dhaka.
            </p>
          </div>

          <Link
            to="/turfs"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-green-600"
          >
            Explore all turfs
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTurfs.map((turf) => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTurfs;