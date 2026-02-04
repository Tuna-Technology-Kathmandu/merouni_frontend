'use client'
import React, { useState } from 'react'
import { FaDownload, FaEye, FaFileAlt } from 'react-icons/fa'
import { Loader2 } from 'lucide-react'

const MaterialItem = ({ material }) => {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async (e) => {
    e.preventDefault()
    setDownloading(true)
    try {
      window.open(material?.file, '_blank')
    } finally {
      setTimeout(() => setDownloading(false), 2000)
    }
  }

  return (
    <div className='group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full'>
      {/* Image / Preview */}
      <div className='relative h-48 bg-gray-50 overflow-hidden'>
        {material?.image ? (
          <img
            src={material.image}
            alt={material.title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-200'>
            <FaFileAlt size={48} />
          </div>
        )}

        {/* Overlay Actions on Image (optional, or keep below) */}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors' />
      </div>

      <div className='p-5 flex flex-col flex-1'>
        <h3 className='text-base font-bold text-gray-900 line-clamp-2 mb-4 flex-1' title={material.title}>
          {material.title}
        </h3>

        <div className='flex items-center gap-3 pt-4 border-t border-gray-50'>
      

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A70A7] text-white font-semibold text-sm hover:bg-[#085a85] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {downloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FaDownload size={14} />
            )}
            <span>{downloading ? 'Opening...' : 'Download'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaterialItem
