import React from 'react'
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa'

const MapSection = ({ university }) => {
    const mapValue = university?.map

    
    if (!mapValue) return null

    // Helper to extract URL if the input is an iframe string
    const getMapUrl = (val) => {
        if (val.includes('<iframe')) {
            const match = val.match(/src="([^"]+)"/)
            return match ? match[1] : null
        }
        return val
    }

    const mapUrl = getMapUrl(mapValue)
    const isEmbeddable = mapUrl && (mapUrl.includes('google.com/maps/embed') || mapUrl.includes('google.com/maps/place'))

    return (
        <section className='w-full mb-14 max-md:mb-7 px-4'>
            <div className='relative max-w-4xl mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-[#30AD8F]/5 to-white border border-[#30AD8F]/10 p-6 md:p-8 shadow-sm'>
                <div className='flex items-center justify-between mb-6'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='font-bold text-lg text-gray-900'>
                            Location Map
                        </h2>
                        <div className='h-1 w-8 bg-[#30AD8F] rounded-full' />
                    </div>
                </div>

                <div className='w-full aspect-[21/7] max-md:aspect-video rounded-xl overflow-hidden border border-white shadow-md bg-gray-50 group relative'>
                    {isEmbeddable ? (
                        <iframe
                            src={mapUrl}
                            className='w-full h-full border-0 grayscale-[0.2] contrast-[1.05]'
                            allowFullScreen=''
                            loading='lazy'
                            title='University Location'
                        />
                    ) : (
                        <div className='w-full h-full flex flex-col items-center justify-center gap-4 bg-[#30AD8F]/5'>
                            <div className='bg-white p-4 rounded-full shadow-md text-[#30AD8F]'>
                                <FaMapMarkerAlt size={24} />
                            </div>
                            <p className='text-gray-700 font-medium text-sm'>
                                {university?.fullname} Campus
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default MapSection
