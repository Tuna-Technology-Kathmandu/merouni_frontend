"use client";
import { Search } from "lucide-react";
import { FaExpandAlt } from "react-icons/fa";
import FilterSection from "./FilterSection";
import DegreeSection from "./DegreeSection";
import AffiliationSection from "./AffiliationSection";
import CourseFeeSection from "./CourseFeeSection";
import UniversityCard from "./UniversityCard";
import { useState } from "react";

// const CourseFeeSection = () => {
//   return (
//     <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg">
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="text-gray-800 font-medium">Course Fees</h3>
//         <svg
//           className="w-4 h-4"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <path d="M19 9l-7 7-7-7" />
//         </svg>
//       </div>
//       <div className="space-y-4">
//         <div className="relative pt-1">
//           <div className="flex items-center justify-between">
//             <span className="text-xs text-green-500">NPR 1,30,000</span>
//             <span className="text-xs text-green-500">NPR 25,00,000</span>
//           </div>
//           <div className="h-2 bg-gray-200 rounded-full mt-2">
//             <div className="h-2 bg-green-500 rounded-full w-full relative">
//               <div className="absolute -left-2 -top-1.5 w-5 h-5 bg-white border-2 border-green-500 rounded-full"></div>
//               <div className="absolute -right-2 -top-1.5 w-5 h-5 bg-white border-2 border-green-500 rounded-full"></div>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-4">
//           <input
//             type="text"
//             value="1,30,000"
//             className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
//           />
//           <input
//             type="text"
//             value="25,00,000"
//             className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

const CollegeFinder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for filters (you'll need to pass these to your filter components)
 
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
  ]

  const universities = [
    {
      name: "Texas College of Management and IT",
      location: "Sifal, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "The British College - Trade Tower",
      location: "Thapathali, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "St. Xavier's College",
      location: "Maitighar, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "Texas College of Management and IT",
      location: "Sifal, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "The British College - Trade Tower",
      location: "Thapathali, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "St. Xavier's College",
      location: "Maitighar, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "Texas College of Management and IT",
      location: "Sifal, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "The British College - Trade Tower",
      location: "Thapathali, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "St. Xavier's College",
      location: "Maitighar, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "Texas College of Management and IT",
      location: "Sifal, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "The British College - Trade Tower",
      location: "Thapathali, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "St. Xavier's College",
      location: "Maitighar, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "Texas College of Management and IT",
      location: "Sifal, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "The British College - Trade Tower",
      location: "Thapathali, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "St. Xavier's College",
      location: "Maitighar, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "Texas College of Management and IT",
      location: "Sifal, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "The British College - Trade Tower",
      location: "Thapathali, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "St. Xavier's College",
      location: "Maitighar, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "Texas College of Management and IT",
      location: "Sifal, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "The British College - Trade Tower",
      location: "Thapathali, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
    },
    {
      name: "St. Xavier's College",
      location: "Maitighar, Kathmandu",
      description:
        "Established in 2009 under the Texas International Education Network, Texas College of Management & IT in Kathmandu offers robust academic programs in Management and Information Technology.",
      logo: "/images/pu.png",
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
            <button className="text-gray-600 text-sm">Clear All</button>
          </div>
        </div>
        <div className="flex  items-center gap-4">
          <div className="flex gap-4">
            <h2 className="text-xl font-semibold">Universities</h2>
            <span className="text-gray-500">(1000+ Colleges)</span>
          </div>
        </div>
        <div className="flex bg-gray-100 items-center rounded-xl ">
          <Search className=" left-3 top-2.5 w-5 h-5 text-gray-400 mx-2" />
          <input
            type="text"
            placeholder="Search by colleges"
            className="w-full  pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none"
          />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university, index) => (
              <UniversityCard key={index} {...university} />
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && <FilterModal />}
    </div>
  );
};

export default CollegeFinder;
