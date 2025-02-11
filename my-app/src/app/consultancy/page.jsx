"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getConsultancies } from "./actions";
import Header from "../components/Frontpage/Header";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";

export default function ConsultanciesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [debouncedSearch, setDebouncedSearch] = useState(queryParam);
  const [consultancyData, setConsultancyData] = useState({ items: [], pagination: {} });

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch data when search or page changes
  useEffect(() => {
    async function fetchData() {
      const data = await getConsultancies(currentPage, debouncedSearch);
      setConsultancyData(data);
    }
    fetchData();
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch !== queryParam) {
      router.push(`/consultancy?q=${debouncedSearch}`, { scroll: false });
    }
  }, [debouncedSearch, queryParam, router]);

  return (
    <>
      <Header />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="border-b-2 border-[#0A70A7] w-[45px] mt-8 mb-4 pl-2">
          <span className="text-2xl font-bold mr-2">Explore</span>
          <span className="text-[#0A70A7] text-2xl font-bold">Consultancies</span>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end w-full">
          <div className="relative w-full max-w-md mb-6">
            <input
              type="text"
              placeholder="Search consultancy..."
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultancyData.items.map((consultancy) => {
            const destinations = JSON.parse(consultancy.destination);
            const address = JSON.parse(consultancy.address);

            return (
              <Link
                href={`/consultancies/${consultancy.slugs}`}
                key={consultancy.id}
                className="block hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={"/images/islington.png"}
                      alt={consultancy.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="p-6">
                    {consultancy.pinned === 1 && (
                      <div className="top-4 right-4">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    )}

                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {consultancy.title}
                    </h2>

                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Destinations:</h3>
                      <div className="flex flex-wrap gap-2">
                        {destinations.map((dest, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                            {dest.city}, {dest.country}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Address:</h3>
                      <p className="text-gray-600 text-sm">
                        {address.street}, {address.city}, {address.state} {address.zip}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-blue-600 font-medium">{consultancy.courses} Courses Available</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {consultancyData.pagination?.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: consultancyData.pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/consultancies?page=${page}`}
                className={`px-4 py-2 rounded ${
                  currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
