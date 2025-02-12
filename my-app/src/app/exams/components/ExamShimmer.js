const ExamShimmer = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 mb-6">
        <div className="animate-pulse">
          {/* Title Shimmer */}
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
          {/* Description Shimmer */}
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
  
          {/* Syllabus & Date Shimmer */}
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
  
          {/* Button Shimmer */}
          <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    );
  };
  
  export default ExamShimmer;
  