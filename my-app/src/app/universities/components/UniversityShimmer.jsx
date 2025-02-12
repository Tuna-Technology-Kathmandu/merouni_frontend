const UniversityShimmer = () => {
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="mb-4 flex flex-row justify-between items-center">
        {/* Title Shimmer */}
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        {/* Image Shimmer */}
        <div className="h-[75px] w-[65px] bg-gray-300 rounded-2xl"></div>
      </div>

      <div className="space-y-2">
        {/* Address Shimmer */}
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>
  );
};

export default UniversityShimmer;
