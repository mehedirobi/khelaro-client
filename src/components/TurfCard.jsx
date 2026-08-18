import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Heart,
  ArrowUpRight,
} from "lucide-react";

const TurfCard = ({ turf }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-100">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={turf.image}
          alt={turf.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Overlay function*/}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
            {turf.sport}
          </span>

          <button
            type="button"
            aria-label={`Add ${turf.name} to favorites`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm transition hover:text-red-500"
          >
            <Heart size={17} />
          </button>
        </div>

        {/* Availability */}
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-gray-950/85 px-3 py-1.5 text-xs font-medium text-white">
            Available today
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              {turf.name}
            </h3>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={14} />
              {turf.location}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
            <Star size={13} fill="currentColor" />
            {turf.rating}
          </div>
        </div>

        <div className="my-4 border-t border-gray-100" />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400">Starting from</p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              ৳{turf.price}
              <span className="ml-1 text-xs font-normal text-gray-400">
                / hour
              </span>
            </p>
          </div>

          <Link
            to={`/turfs/${turf.id}`}
            className="group/link inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-green-600"
          >
            View details
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TurfCard;