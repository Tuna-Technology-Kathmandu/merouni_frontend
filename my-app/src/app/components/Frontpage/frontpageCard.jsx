import Image from "next/image";
import Link from "next/link";

const FrontPageCardShimmer = () => {
  return (
    <div className="w-full rounded-2xl bg-gray-100 overflow-hidden shadow-lg animate-pulse">
      <div className="relative h-48 bg-gray-200"> 
        <div className="h-full bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 opacity-50"></div>
      </div>
      <div className="px-4 py-2">
        <div className="h-8 bg-gray-200 rounded mb-2"></div> 
        <div className="h-6 bg-gray-200 rounded mb-1"></div> 
        <hr className="my-2 bg-gray-300" />
        <div className="mt-2">
          <div className="h-6 bg-gray-200 rounded mb-1 w-1/2"></div>
          <ul className="list-disc pl-4 text-sm text-gray-600">
            {[...Array(3)].map((_, i) => ( 
              <li key={i} className="h-5 bg-gray-200 rounded mb-1"></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function FrontPageCard({ colleges, isLoading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading ? (
        <>
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <FrontPageCardShimmer />
            </div>
          ))}
        </>
      ) : (
        colleges.slice(0, 4).map((college, index) => (
          <div
            key={index}
            className="w-full rounded-2xl bg-gray-100 overflow-hidden shadow-lg"
          >
            <div className="relative">
              <Link href={`/college/${college.slugs}`}>
                <Image
                  src={college.featured_img || "/images/course_description.png"}
                  alt={college.name}
                  width={800}
                  height={280}
                  className="h-48 w-full object-cover" // Adjusted height for better aspect ratio
                  priority // Added priority for better initial load
                />
              </Link>
              <a
                href={college.website_url || "https://www.example.com/"}
                target="_blank"
                rel="noopener noreferrer" // Added for security best practice
              >
                <button className="absolute bottom-2 right-2 rounded-full border border-gray-100 bg-blue-500 px-3 py-1 text-xs text-white shadow-md hover:bg-blue-600">
                  Apply
                </button>
              </a>
            </div>
            <div className="px-4 py-2">
              <Link
                href={`/colleges/${college.slugs}`}
                className="text-lg font-semibold hover:underline" // Added hover effect
              >
                {college.name}
              </Link>
              <div className="text-xs text-gray-600 mt-1">
                <Link
                  href={`/colleges/${college.slugs}`}
                  className="hover:underline"
                >
                  {" "}
                  {/* Added hover effect */}
                  {college.address.city}, {college.address.state},{" "}
                  {college.address.country}
                </Link>
              </div>
              <hr className="my-2" />

              {/* Show only if programs exist */}
              {college.collegeCourses?.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-gray-700">Programs:</p>
                  <ul className="list-disc pl-4 text-sm text-gray-600">
                    {college.collegeCourses.slice(0, 3).map((course, i) => (
                      <li key={i} className="truncate">
                        {" "}
                        {/* Added truncate for long program names */}
                        <Link
                          href={`/degree/${course.program.slugs}`}
                          className="hover:underline"
                        >
                          {" "}
                          {/* Added hover effect */}
                          {course.program.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
