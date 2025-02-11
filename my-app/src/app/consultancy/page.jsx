// page.jsx
import Image from "next/image";
import Link from "next/link";
import { getConsultancies } from "./actions";
import Header from "../components/Frontpage/Header";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";

export default async function ConsultanciesPage({ searchParams }) {
  const currentPage = Number(searchParams?.page) || 1;
  const { items, pagination } = await getConsultancies(currentPage);
  return (
    <>
      <Header />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Education Consultancies
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((consultancy) => {
            // Parse JSON strings
            const destinations = JSON.parse(consultancy.destination);
            const address = JSON.parse(consultancy.address);

            return (
              <Link
                href={`/consultancies/${consultancy.slugs}`}
                key={consultancy.id}
                className="block hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                  {/* Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      // src={consultancy.featured_image || "/api/placeholder/800/400"}
                      src={"/images/islington.png"}
                      alt={consultancy.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Pinned Badge */}
                    {consultancy.pinned === 1 && (
                      <div className=" top-4 right-4">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {consultancy.title}
                    </h2>

                    {/* Destinations */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Destinations:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {destinations.map((dest, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                          >
                            {dest.city}, {dest.country}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Address:
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {address.street}, {address.city}, {address.state}{" "}
                        {address.zip}
                      </p>
                    </div>

                    {/* Courses */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-blue-600 font-medium">
                        {consultancy.courses} Courses Available
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Link
                  key={page}
                  href={`/consultancies?page=${page}`}
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
      </div>

      <Footer />
    </>
  );
}
