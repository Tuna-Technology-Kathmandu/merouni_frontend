import { getCareers } from "./actions";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Navbar from "../components/Frontpage/Navbar";
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function CareersPage({ searchParams }) {
  const currentPage = Number(searchParams.page) || 1;
  const { items, pagination } = await getCareers(currentPage);

  return (
    <>
        <Header />
        <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((career) => (
            <Link
              href={`/careers/${career.slugs}`}
              key={career.id}
              className="block hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                <div className="relative h-48 w-full">
                  <Image
                    // src={career.featuredImage || "/api/placeholder/800/400"}
                    src={"/images/islington.png"}
                    alt={career.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {career.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {career.description}
                  </p>

                  <div className="text-sm text-gray-500">
                    <p>Posted: {formatDate(career.createdAt)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Link
                  key={page}
                  href={`/careers?page=${page}`}
                  className={`px-4 py-2 rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </Link>
              )
            )}
          </div>
        )}

        {/* Pagination Info */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Page {pagination.currentPage} of {pagination.totalPages} | Total
          entries: {pagination.totalCount}
        </div>
      </div>
      <Footer/>
    </>
  );
}
