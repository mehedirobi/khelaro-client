import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="bg-gray-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-green-600 px-6 py-14 text-center sm:px-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
          <Search size={22} />
        </div>

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready for your next game?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-green-50 sm:text-base">
          Find a turf near you, choose an available slot, and get your
          game started.
        </p>

        <Link
          to="/turfs"
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
        >
          Find a turf
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;