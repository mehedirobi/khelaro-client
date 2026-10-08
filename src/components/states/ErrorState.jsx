import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load the requested data. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex min-h-[280px] items-center justify-center px-4 py-10 sm:min-h-[300px]">
      <div className="w-full max-w-md text-center">
        <div
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500"
        >
          <AlertCircle size={27} strokeWidth={2} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-gray-900 sm:text-xl">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:ring-offset-2"
          >
            <RefreshCw
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:rotate-180"
              aria-hidden="true"
            />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;