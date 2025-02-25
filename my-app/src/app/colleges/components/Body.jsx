"use client";
import { Search } from "lucide-react";
import { FaExpandAlt } from "react-icons/fa";
import FilterSection from "./FilterSection";
import DegreeSection from "./DegreeSection";
import AffiliationSection from "./AffiliationSection";
import CourseFeeSection from "./CourseFeeSection";
import UniversityCard from "./UniversityCard";
import { useState, useEffect, useCallback } from "react";
import { getColleges, searchColleges } from "../actions";
import { debounce } from "lodash";
import Link from "next/link";
import UniversityCardShimmer from "./UniversityShimmerCard";
import Pagination from "@/app/blogs/components/Pagination";

const CollegeFinder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalCount: 1,
   
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    disciplines: [],
    state: [],
    degrees: [],
    affiliations: [],
    courseFees: { min: 0, max: 1000000 },
  });

  useEffect(() => {
    if (!searchQuery) {
      fetchColleges(pagination.currentPage,selectedFilters);
    }
  }, [pagination.currentPage, searchQuery,selectedFilters]);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query) {
        setIsSearching(true);
        const results = await searchColleges(query);
        console.log("Search Results in college:", results);
        setUniversities(results.colleges);
        setPagination(results.pagination);
        setIsSearching(false);
      }
    }, 1000), // 1000ms delay
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    console.log("querY:", query);
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const fetchColleges = async (page) => {
    setIsLoading(true);
    try {
      console.log("INside fetch college");
      const data = await getColleges(page, selectedFilters);
      console.log("Getting data in college page:", data);
      setUniversities(data.colleges);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {}, [universities]);

  const filters = [
    {
      title: "Discipline ",
      placeholder: "Search by discipline",
      options: [
        { name: "Agriculture" },
        { name: "Agriculture, Forestry, and Animal Sciences" },
        { name: "Allied Health Sciences" },
        { name: "Animal Sciences" },
        { name: "Architecture" },
        { name: "Ayurveda" },
        { name: "Biotechnology" },
        { name: "Chemical Engineering" },
        { name: "Civil Engineering" },
        { name: "Computer Engineering" },
        { name: "Computer and Information Technology" },
        { name: "Dentistry and Oral Health" },
        { name: "Development Studies" },
        { name: "Education" },
        { name: "Electrical Engineering" },
        { name: "Electronics Engineering" },
        { name: "Energy and Power Engineering" },
        { name: "Engineering" },
        { name: "Environmental Sciences" },
        { name: "Fashion Technology" },
        { name: "Finance and Accounting" },
        { name: "Fine Arts and Performing Arts" },
        { name: "Fisheries" },
        { name: "Forestry" },
        { name: "Geology" },
        { name: "Health Sciences" },
        { name: "Hospitality and Tourism" },
        { name: "Humanities" },
        { name: "Journalism and Mass Communication" },
        { name: "Law" },
        { name: "Library and Information Sciences" },
        { name: "Linguistics and Languages" },
        { name: "Management" },
        { name: "Mathematics and Statistics" },
        { name: "Mechanical Engineering" },
        { name: "Medical Sciences" },
        { name: "Medicine" },
        { name: "Microbiology" },
        { name: "Military Sciences" },
        { name: "Music" },
        { name: "Nanotechnology" },
        { name: "Nursing" },
        { name: "Optometry" },
        { name: "Paramedical Sciences" },
        { name: "Pharmaceutical Sciences" },
        { name: "Philosophy" },
        { name: "Physical Education and Sports" },
        { name: "Physics" },
        { name: "Physiotherapy" },
        { name: "Political Science and International Relations" },
        { name: "Psychology" },
        { name: "Public Administration" },
        { name: "Public Health" },
        { name: "Rural Development" },
        { name: "Science and Technology" },
        { name: "Social Sciences" },
        { name: "Sociology" },
        { name: "Space Science" },
        { name: "Veterinary Sciences" },
        { name: "Yoga" },
      ],
      selectedItems: selectedFilters.disciplines,
      onSelectionChange: (items) => {
        setSelectedFilters((prev) => ({ ...prev, disciplines: items }));
      },
    },
    {
      title: "State ",
      placeholder: "Search by state",
      options: [
        { name: "Bagmati" },
        { name: "Gandaki" },
        { name: "Karnali" },
        { name: "Koshi" },
        { name: "Lumbini" },
        { name: "Madhesh" },
        { name: "Sudurpashchim" },
      ],
      selectedItems: selectedFilters.states,
      onSelectionChange: (items) => {
        setSelectedFilters((prev) => ({ ...prev, states: items }));
      },
    },
  ];

  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[60%] h-full max-h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Filters</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        {/* Responsive Filter Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filters.map((filter, index) => (
            <FilterSection key={index} {...filter} />
          ))}
          <DegreeSection />
          <AffiliationSection />
          <CourseFeeSection />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
  
  const handlePageChange = (page) => {
    console.log("Pages response from pagination controle:", page);
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 rounded-full mx-2 disabled:opacity-50"
      >
        &lt;
      </button>
      <span className="text-gray-600">
        Page {currentPage} of {pagination.totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pagination.totalPages}
        className="px-4 py-2 bg-gray-300 rounded-full mx-2 disabled:opacity-50"
      >
        &gt;
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
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
            <h2 className="text-xl font-semibold">Colleges</h2>
            <span className="text-gray-500">
              ({pagination.totalCount || "0"} Colleges)
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

        <div className=" md:w-3/4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <UniversityCardShimmer key={index} />
              ))}
            </div>
          ) : (
            <>
              {universities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universities.map((university, index) => (
                    <UniversityCard key={index} {...university} />
                  ))}
                </div>
              ) : (
                <NoResultsFound />
              )}
              {!searchQuery && universities.length > 0 && (
                <Pagination
                  onPageChange={handlePageChange}
                  pagination={pagination}
                />
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
