import { Search } from "lucide-react";

const FilterSection = ({
  title,
  options,
  placeholder,
  selectedItems,
  onSelectionChange,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-800 font-medium">{title}</h3>
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none"
        />
      </div>
      <div className="mt-3 space-y-2 overflow-y-auto h-24 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-100">
        {options.map((option, index) => (
          <label key={index} className="flex items-center gap-2">
            <input type="checkbox" className="rounded-full border-gray-300" />
            <span className="text-gray-700 text-sm">{option.name}</span>
            <span className="text-gray-500 text-sm ml-auto mr-2">
              ({option.count})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
export default FilterSection;
