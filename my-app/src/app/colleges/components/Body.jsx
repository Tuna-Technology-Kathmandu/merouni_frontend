"use client";
import { Search } from "lucide-react";
import { FaExpandAlt } from "react-icons/fa";
import FilterSection from "./FilterSection";
import DegreeSection from "./DegreeSection";
import AffiliationSection from "./AffiliationSection";
import CourseFeeSection from "./CourseFeeSection";
import UniversityCard from "./UniversityCard";
import { useState, useEffect, useCallback } from "react";
// import { getColleges, searchColleges } from "../actions";
import { searchColleges } from "../actions";
import { debounce } from "lodash";
import Link from "next/link";
import { getColleges } from "@/app/action";

const CollegeFinder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (!searchQuery) {
      fetchColleges(currentPage);
    }
  }, [currentPage, searchQuery]);
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query) {
        setIsSearching(true);
        const results = await searchColleges(query);
        setUniversities(results.colleges);
        setPagination(results.pagination);
        setIsSearching(false);
      }
    }, 1000), // 1000ms delay
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const fetchColleges = async (page) => {
    setIsLoading(true);
    try {
      const data = await getColleges(undefined, undefined, 10, page);
      console.log("Getting data in college page:", data);
      setUniversities(data.items);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("UNiversity fetch:", universities[8]);
  }, [universities]);

  const filters = [
    {
      title: "Discipline (32)",
      placeholder: "Search by discipline",
      options: [
        { name: "Agriculture", count: 12 },
        { name: "Animal Sciences", count: 18 },
        { name: "Architecture", count: 22 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
      ],
    },
    {
      title: "State (132)",
      placeholder: "Search by state",
      options: [
        { name: "Kathmandu", count: 12 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
      ],
    },
    {
      title: "State (132)",
      placeholder: "Search by state",
      options: [
        { name: "Kathmandu", count: 12 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
      ],
    },
    {
      title: "State (132)",
      placeholder: "Search by state",
      options: [
        { name: "Kathmandu", count: 12 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
      ],
    },
    {
      title: "State (132)",
      placeholder: "Search by state",
      options: [
        { name: "Kathmandu", count: 12 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
      ],
    },
    {
      title: "State (132)",
      placeholder: "Search by state",
      options: [
        { name: "Kathmandu", count: 12 },
        { name: "Pokhara", count: 18 },
        { name: "Lalitpur", count: 22 },
        { name: "Kaski", count: 8 },
      ],
    },
  ];

  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[80%] h-[80%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Filters</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {filters.map((filter, index) => (
            <FilterSection
              key={index}
              {...filter}
              selectedItems={selectedFilters.disciplines}
              onSelectionChange={(items) => {
                setSelectedFilters((prev) => ({ ...prev, disciplines: items }));
              }}
            />
          ))}
          <DegreeSection
            selectedDegrees={selectedFilters.degrees}
            onSelectionChange={(degrees) => {
              setSelectedFilters((prev) => ({ ...prev, degrees }));
            }}
          />
          <AffiliationSection
            selectedAffiliations={selectedFilters.affiliations}
            onSelectionChange={(affiliations) => {
              setSelectedFilters((prev) => ({ ...prev, affiliations }));
            }}
          />
          <CourseFeeSection
            range={selectedFilters.courseFees}
            onRangeChange={(range) => {
              setSelectedFilters((prev) => ({ ...prev, courseFees: range }));
            }}
          />
        </div>
      </div>
    </div>
  );

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={!pagination.hasPreviousPage}
        className={`px-4 py-2 rounded-lg ${
          pagination.hasPreviousPage
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {currentPage} of {pagination.totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={!pagination.hasNextPage}
        className={`px-4 py-2 rounded-lg ${
          pagination.hasNextPage
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
  const NoResultsFound = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <Search className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600">No Results Found</h3>
      <p className="text-gray-500 mt-2">
        Try adjusting your search criteria or browse all colleges
      </p>
    </div>
  );
  return (
    <div className="max-w-[1600px] mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex gap-3">
            <button
              className="text-gray-600 text-sm flex items-center hover:text-gray-800"
              onClick={() => setIsModalOpen(true)}
            >
              <div>Expand</div>
              <div className="mx-2">
                <FaExpandAlt />
              </div>
            </button>
            <button
              className="text-gray-600 text-sm"
              onClick={() => setSearchQuery("")}
            >
              Clear All
            </button>
          </div>
        </div>
        <div className="flex  items-center gap-4">
          <div className="flex gap-4">
            <h2 className="text-xl font-semibold">Universities</h2>
            <span className="text-gray-500">
              ({pagination.totalRecords || "0"} Colleges)
            </span>
          </div>
        </div>
        <div className="flex bg-gray-100 items-center rounded-xl ">
          <Search className=" left-3 top-2.5 w-5 h-5 text-gray-400 mx-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by colleges"
            className="w-full pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none"
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-8">
        <div className="w-1/4 space-y-4 hidden md:block">
          {filters.map((filter, index) => (
            <FilterSection key={index} {...filter} />
          ))}
          <DegreeSection />
          <AffiliationSection />
          <CourseFeeSection />
        </div>

        <div className="w-3/4">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university, index) => (
              <UniversityCard key={index} {...university} />
            ))}
          </div> */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            // <>
            //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            //     {universities.map((university, index) => (
            //       <UniversityCard key={index} {...university} />
            //     ))}
            //   </div>
            //   <PaginationControls />
            // </>
            <>
              {universities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universities.map((university, index) => (
                    <Link href={`/colleges/${university.slugs}`} key={index}>
                      <UniversityCard key={index} {...university} />
                    </Link>
                  ))}
                </div>
              ) : (
                <NoResultsFound />
              )}
              {!searchQuery && universities.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.hasPreviousPage
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.hasNextPage
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {isModalOpen && <FilterModal />}
    </div>
  );
};

export default CollegeFinder;
