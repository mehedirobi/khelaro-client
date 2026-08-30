import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 text-green-600">
          <SearchX size={38} />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-green-600">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
          Sorry, the page you are looking for does not exist or may have
          been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;