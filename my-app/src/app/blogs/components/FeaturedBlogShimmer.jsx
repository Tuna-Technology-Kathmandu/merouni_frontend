import Shimmer from "@/app/components/Shimmer";

const FeaturedBlogsShimmer = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="relative rounded-lg overflow-hidden shadow-lg p-4">
          {/* Shimmer Image */}
          <Shimmer width="100%" height="160px" borderRadius="8px" className="mb-4" />

          {/* Shimmer Title */}
          <Shimmer width="75%" height="16px" className="mb-8" />

          {/* Shimmer Description */}
          <Shimmer width="90%" height="12px" className="mb-8" />

          {/* Shimmer Date */}
          <Shimmer width="50%" height="12px" />
        </div>
      ))}
    </div>
  );
};

export default FeaturedBlogsShimmer;
