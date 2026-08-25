import { SearchX } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display right now.",
  action,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
        <SearchX size={24} className="text-gray-400" />
      </div>

      <h3 className="mt-5 font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {message}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;