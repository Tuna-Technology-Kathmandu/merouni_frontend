import React from 'react'

const MapSection = ({ college }) => {
    if (!college?.google_map_url) return null

    // Use map_type to decide rendering strategy - defaults to embed (iframe) if null
    const isEmbed = college?.map_type !== 'google_map_url'

    const getMapUrl = (rawUrl) => {
        if (!rawUrl) return ''
        // If it's an iframe tag, extract the src
        if (rawUrl.includes('<iframe')) {
            const match = rawUrl.match(/src="([^"]+)"/)
            return match ? match[1] : ''
        }
        return rawUrl
    }

    const mapUrl = getMapUrl(college?.google_map_url)

    return (
        <div className='bg-white rounded-md border p-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-6'>Location on Map</h2>
            <div className='w-full h-[400px] rounded-md overflow-hidden border border-gray-100 shadow-sm'>
                {isEmbed && mapUrl ? (
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                ) : !isEmbed && mapUrl ? (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50 gap-4">
                        <p className="text-gray-600 font-medium">View the location on Google Maps</p>
                        <a
                            href={college.google_map_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-[#0A6FA7] text-white rounded-md hover:bg-[#085e8a] transition-all font-medium text-sm shadow-md"
                        >
                            Open Google Maps
                        </a>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default MapSection
