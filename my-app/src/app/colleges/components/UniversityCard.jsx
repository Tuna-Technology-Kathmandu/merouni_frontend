import { Share, Heart } from "lucide-react";

const UniversityCard = ({ name, location, description, logo }) => {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300  hover:scale-105 hover:border-gray-300">
        <div className="flex justify-between items-start mb-4">
          <img
            src="/images/pu.png"
            alt={`${name} logo`}
            className="w-12 h-12 object-contain"
          />
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Share className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-black text-sm my-4">{description}</p>
        <div className="flex gap-3">
          <button className="flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
            Details
          </button>
          <button className="flex-1 py-2 px-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 text-sm font-medium">
            Apply Now
          </button>
        </div>
      </div>
    );
  };
  export default UniversityCard