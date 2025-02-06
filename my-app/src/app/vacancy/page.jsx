// page.jsx
import Image from "next/image";
import Link from "next/link";
import { getCareers } from "./actions";
import Header from "../components/Frontpage/Header";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function VacanciesPage({ searchParams }) {
  const currentPage = Number(searchParams.page) || 1;
  const data = await getCareers(currentPage);
  const { items, pagination } = data;

  return (
    <>
      <Header />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Current Vacancies
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((vacancy) => (
            <Link
              href={`/vacancies/${vacancy.slug}`}
              key={vacancy.id}
              className="block hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full border border-gray-200">
                {/* Image */}
                <div className="relative h-48 w-full">
                  <Image
                    //   src={vacancy.featuredImage || "/api/placeholder/800/400"}
                    src={"/images/islington.png"}
                    alt={vacancy.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="mb-4">
                
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {vacancy.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {vacancy.description}
                  </p>
                  <p>Posted: {formatDate(vacancy.createdAt)}</p>

                  {/* Footer Info */}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <div className="flex justify-center gap-2">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Link
                  key={page}
                  href={`/vacancies?page=${page}`}
                  className={`px-4 py-2 rounded-md transition-colors
                  ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Showing page {pagination.currentPage} of {pagination.totalPages} |
              Total vacancies: {pagination.totalCount}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
