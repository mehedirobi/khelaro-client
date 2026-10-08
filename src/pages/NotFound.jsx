import { Link } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  SearchX,
  ArrowRight,
  Compass,
} from "lucide-react";

const NotFound = () => {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gray-50 px-4 py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[15%] h-32 w-32 animate-pulse rounded-full bg-green-100/50 blur-3xl" />

        <div className="absolute bottom-[10%] right-[8%] h-40 w-40 animate-pulse rounded-full bg-green-100/40 blur-3xl [animation-delay:1s]" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl text-center">
        {/* Icon */}
        <div className="animate-in fade-in zoom-in-75 duration-700">
          <div className="group relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-green-100 bg-white text-green-600 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5">
            <div className="absolute inset-0 animate-ping rounded-3xl bg-green-100/40 [animation-duration:3s]" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 transition duration-500 group-hover:rotate-3 group-hover:scale-105">
              <SearchX
                size={34}
                strokeWidth={1.8}
                className="transition-transform duration-500 group-hover:-rotate-6"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 duration-700 [animation-delay:150ms] [animation-fill-mode:both]">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <Compass size={13} />
            Error 404
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
            The page you're looking for doesn't exist, may have
            been moved, or the link might be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 flex flex-col justify-center gap-3 duration-700 [animation-delay:300ms] [animation-fill-mode:both] sm:flex-row">
          <Link
            to="/"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20"
          >
            <Home
              size={17}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            Back to Home

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Go Back
          </button>
        </div>

        {/* Bottom hint */}
        <div className="animate-in fade-in mt-10 duration-700 [animation-delay:450ms] [animation-fill-mode:both]">
          <div className="mx-auto flex max-w-sm items-center justify-center gap-3 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />

            <span>Need somewhere to start?</span>

            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <Link
            to="/turfs"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 transition hover:text-green-700"
          >
            Explore available turfs
            <ArrowRight
              size={15}
              className="transition-transform duration-300 hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;