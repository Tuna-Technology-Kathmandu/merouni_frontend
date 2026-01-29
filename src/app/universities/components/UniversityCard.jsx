'use client'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'

const UniversityCard = ({ university }) => {
    return (
        <Link
            href={`/universities/${university?.slugs}`}
            className='group block bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300'
        >
            <div className='flex items-start justify-between gap-4 mb-6'>
                <div className='flex-1'>
                    <h2 className='text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#0A70A7] transition-colors'>
                        {university.fullname}
                    </h2>
                    <div className='flex items-center text-gray-500 text-sm mt-3'>
                        <MapPin className='w-4 h-4 mr-1.5 shrink-0' />
                        <span className='line-clamp-1'>
                            {university.city}, {university.state}
                        </span>
                    </div>
                </div>
                <div className='w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0'>
                    <img
                        src={
                            university?.featured_image ||
                            `https://avatar.iran.liara.run/username?username=${university?.fullname}`
                        }
                        alt={`${university.fullname} Logo`}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://placehold.co/100x100?text=U'
                        }}
                    />
                </div>
            </div>

            <div className='flex items-center text-[#0A70A7] font-medium text-sm mt-4 pt-4 border-t border-gray-50 group-hover:translate-x-1 transition-transform'>
                <span>View Details</span>
                <ArrowRight className='w-4 h-4 ml-2' />
            </div>
        </Link>
    )
}

export default UniversityCard
