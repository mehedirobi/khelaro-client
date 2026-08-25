const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

      <p className="mt-4 text-sm text-gray-500">
        {message}
      </p>
    </div>
  );
};

export default LoadingState;