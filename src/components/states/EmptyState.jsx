import { SearchX } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display right now.",
  action,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center sm:px-6 sm:py-16">
      <div
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100"
      >
        <SearchX size={24} className="text-gray-400" />
      </div>

      <h3 className="mt-5 text-base font-semibold text-gray-900 sm:text-lg">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {message}
      </p>

      {action && (
        <div className="mt-6 flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;