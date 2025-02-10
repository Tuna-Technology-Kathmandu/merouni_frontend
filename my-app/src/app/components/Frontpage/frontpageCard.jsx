import Image from "next/image";
import Link from "next/link";

export default function FrontPageCard({ colleges }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
      {colleges.slice(0, 4).map((college, index) => (
        <div
          key={index}
          className="w-100 rounded-2xl bg-gray-100 overflow-hidden shadow-lg"
        >
          <div className="relative">
            <Link href={`/college/${college.slugs}`}>
              <Image
                src={college.featured_img || "/images/course_description.png"}
                alt={college.name}
                width={800}
                height={280}
                className="h-24 w-full object-cover"
              />
            </Link>
            <a
              href={college.website_url || "https://www.example.com/"}
              target="_blank"
            >
              <button className="btn primary absolute bottom-2 right-2 rounded-full border border-gray-100 bg-blue-500 px-3 py-1 text-xs text-white shadow-md hover:bg-blue-600">
                Apply
              </button>
            </a>
          </div>
          <div className="px-4 py-2">
            <Link
              href={`/colleges/${college.slugs}`}
              className="text-lg font-semibold"
            >
              {college.name}
            </Link>
            <div className="text-xs text-gray-600 mt-1">
              <Link href={`/colleges/${college.slugs}`}>
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
                    <Link href={`/degree/${course.program.slugs}`} key={i}>
                      <li key={i}>{course.program.title}</li>
                    </Link>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
