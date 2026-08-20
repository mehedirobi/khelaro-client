import { Heart, MapPin, Star, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const wishlistTurfs = [
  {
    id: "turf-001",
    name: "Green Field Sports Arena",
    location: "Uttara, Dhaka",
    sport: "Football",
    rating: 4.8,
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "turf-003",
    name: "Urban Sports Zone",
    location: "Mohammadpur, Dhaka",
    sport: "Football",
    rating: 4.9,
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80",
  },
];

const Wishlist = () => {
  return (
    <main>
      <div>
        <p className="text-sm font-medium text-green-600">
          Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          Wishlist
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Your saved turfs for future games.
        </p>
      </div>

      {wishlistTurfs.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {wishlistTurfs.map((turf) => (
            <article
              key={turf.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={turf.image}
                  alt={turf.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <button
                  type="button"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-sm"
                >
                  <Heart
                    size={18}
                    fill="currentColor"
                  />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-medium text-green-600">
                      {turf.sport}
                    </span>

                    <h2 className="mt-1 font-semibold text-gray-900">
                      {turf.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                    <Star
                      size={15}
                      fill="currentColor"
                    />
                    {turf.rating}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={15} />
                  {turf.location}
                </div>

                <div className="my-5 h-px bg-gray-100" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">
                      Starting from
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      ৳{turf.price.toLocaleString()}
                      <span className="ml-1 text-xs font-normal text-gray-400">
                        / hour
                      </span>
                    </p>
                  </div>

                  <Link
                    to={`/turfs/${turf.id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-green-600"
                  >
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white py-20 text-center">
          <Heart
            size={38}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            Your wishlist is empty
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Save your favorite turfs and find them here later.
          </p>

          <Link
            to="/turfs"
            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            Explore Turfs
          </Link>
        </div>
      )}
    </main>
  );
};

export default Wishlist;