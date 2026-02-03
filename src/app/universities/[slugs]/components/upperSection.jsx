import React, { useState } from 'react'
import { PiLineVerticalThin } from 'react-icons/pi'
import { MdDateRange } from 'react-icons/md'
import { LiaUniversitySolid } from 'react-icons/lia'
import { FaPhoneAlt } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import { IoMdMail } from 'react-icons/io'
import he from 'he'
import { FormatDate } from '@/lib/date'
import AddressSection from './AddressAndContactSection'
import MemberSection from './MemberSection'
import VideoSection from './VideoSection'
import LevelSections from './LevelSections'

const ImageSection = ({ university }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <div className='flex flex-col items-center'>
      {/* Top Section (Already Styled) */}

      <div className='w-full'>
        <img
          src={
            university?.assets?.featured_image !== ''
              ? university?.assets?.featured_image
              : '/images/degreeHero.webp'
          }
          alt={university?.fullname || 'University Image'}
          className='h-[25vh] w-full md:h-[400px] object-cover bg-gray-200'
        />
        <div className='flex flex-row lg:h-[95px] bg-[#30AD8F] bg-opacity-5 items-center p-0 px-8 sm:px-14 md:px-24'>
          <div className='flex items-center justify-center rounded-full bg-white -translate-y-8 overflow-hidden w-24 h-24 md:w-32 md:h-32'>
            <img
              src={
                university?.featured_image ||
                `https://avatar.iran.liara.run/username?username=${university?.fullname}`
              }
              alt='uni logo'
              className='object-cover w-full h-full rounded-full aspect-square'
            />
          </div>
          <div className='ml-4'>
            <h2 className='font-bold text-lg lg:text-4xl lg:leading-[50px]'>
              {university?.fullname || ''}
            </h2>
          </div>
        </div>
      </div>

      {/* Key Facts Section */}
      <div
        className='w-[1000px] max-[1037px]:!w-[800px] max-[818px]:!w-full bg-[#30AD8F] bg-opacity-10 text-black rounded-md 
     flex md:flex-row md:gap-0  max-[988px]:!gap-0 my-12 items-center justify-center flex-col gap-10 max-md:space-y-4
     px-[75px] max-md:px-[30px] h-auto md:h-[150px] p-8'
      >
        {/* Established */}
        <div className='flex flex-col items-center min-[1037px]:pr-14'>
          <MdDateRange size={30} className='text-[#30AD8F]' />
          <p className='whitespace-nowrap text-sm'>
            {FormatDate.formatDate(university?.date_of_establish) || 'N/A'}
          </p>
        </div>

        <div className='md:flex items-center pr-5 hidden'>
          <PiLineVerticalThin size={60} />
        </div>

        {/* Type */}
        <div className='flex flex-col items-center min-[1037px]:px-14'>
          <LiaUniversitySolid size={32} className='text-[#30AD8F]' />
          <p className='whitespace-nowrap text-sm'>
            {university?.type_of_institute || 'N/A'}
          </p>
        </div>

        <div className='md:flex items-center pr-5 hidden'>
          <PiLineVerticalThin size={60} />
        </div>

        {/* Phone */}
        <div className='flex flex-col items-center min-[1037px]:px-14'>
          <FaPhoneAlt size={24} className='text-[#30AD8F]' />
          <p className='whitespace-nowrap text-sm'>
            {university?.contact?.phone_number || 'N/A'}
          </p>
        </div>

        <div className='md:flex items-center pr-5 hidden'>
          <PiLineVerticalThin size={60} />
        </div>

        {/* Email */}
        <div className='flex flex-col items-center min-[1037px]:pl-14'>
          <IoMdMail size={26} className='text-[#30AD8F]' />
          <p className='whitespace-nowrap text-sm break-words'>
            {university?.contact?.email || 'N/A'}
          </p>
        </div>
      </div>

      {/* Why Study Here */}
      <div className=' rounded-xl p-8 w-full lp:w-[80%] mb-12 max-md:mb-7 px-[75px] max-md:px-[30px]'>
        <h2 className='font-bold text-xl md:text-2xl mb-4'>
          About {university?.fullname}
        </h2>
        <div
          dangerouslySetInnerHTML={{
            __html: he.decode(university?.description || '')
          }}
          className="leading-7 text-justify space-y-4
          [&>iframe]:w-full 
             [&>iframe]:max-w-[calc(100vw-40px)] 
             [&>iframe]:aspect-video 
             [&>iframe]:h-auto
             [&>iframe]:rounded-lg 
             [&>iframe]:mt-4
             [&>iframe]:mx-auto
             [&>iframe]:block

             /* Table wrapper styles */
             [&_.table-wrapper]:overflow-x-auto
             [&_.table-wrapper]:my-4
             [&_.table-wrapper]:w-full
             [&_.table-wrapper]:[scrollbar-width:thin]
             [&_.table-wrapper]:[scrollbar-color:gray-300_transparent]

             /* Table styles */
             [&_table]:min-w-full
             [&_table]:border-collapse
             [&_th]:bg-gray-100
             [&_th]:p-2
             [&_th]:text-left
             [&_th]:border
             [&_th]:border-gray-300
             [&_td]:p-2
             [&_td]:border
             [&_td]:border-gray-300
             [&_tr:nth-child(even)]:bg-gray-50

             /* Other styles */
             [&_h1]:text-2xl
             [&_h1]:font-bold
             [&_h1]:mt-8
             [&_h1]:mb-4
             [&_h2]:text-xl
             [&_h2]:font-bold
             [&_h2]:mt-6
             [&_h2]:mb-3
             text-xs md:text-sm lg:text-base
             [&_ol]:pl-8 
             [&_ol]:my-4
             [&_ol]:space-y-2
             [&_ul]:list-disc 
             [&_ul]:pl-8 
             [&_ul]:my-4
             [&_ul]:space-y-2
             [&_li]:pl-2
             max-lg:[&_ol]:text-sm
             max-lg:[&_ul]:text-sm
             max-lg:[&_ol]:space-y-1
             max-lg:[&_ul]:space-y-1'
          "
        />
      </div>

      {/* Programs Section */}
      {/* {Array.isArray(university?.programs) &&
        university?.programs?.program?.length > 0 && (
          <div className='bg-[#30AD8F] bg-opacity-10 rounded-xl p-8 w-full mb-12 px-[75px] max-md:px-[30px] overflow-hidden'>
            <h2 className='font-bold text-xl md:text-2xl mb-6'>
              Programs Offered
            </h2>
            <ul className='list-disc pl-5 space-y-2 text-gray-700'>
              {university?.programs?.program?.map((programItem, idx) => (
                <li
                  key={programItem?.id || idx}
                  className='text-sm md:text-base'
                >
                  {typeof programItem === 'string'
                    ? programItem
                    : programItem?.title ||
                      programItem?.program ||
                      programItem?.name ||
                      'N/A'}
                </li>
              ))}
            </ul>
          </div>
        )} */}

      {/* college programs */}

      {Array.isArray(university?.programs) &&
        university.programs.length > 0 && (
          <section className="w-full mb-14 max-md:mb-7">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#30AD8F]/10 to-[#30AD8F]/5 p-10 max-md:p-6 px-[75px] max-md:px-[30px]">

              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-lg md:text-xl mb-4 text-gray-900">
                  Programs Offered
                </h2>

                <span className="text-sm font-medium bg-[#30AD8F]/20 text-[#30AD8F] px-4 py-1.5 rounded-full">
                  {university.programs.length} Program
                  {university.programs.length > 1 && "s"}
                </span>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {university.programs.map((item, idx) => (
                  <li
                    key={item.id || idx}
                    className="group flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[#30AD8F] group-hover:scale-125 transition-transform" />

                    <span className="text-sm md:text-base font-medium text-gray-800">
                      {item?.program?.title || "N/A"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

      {/* levels */}
      <LevelSections university={university} />


      {/* members */}
      <MemberSection university={university} />


      {/* addressSection */}
      <AddressSection university={university} />

      {/* contact section */}


      {/* Gallery Section */}
      {Array.isArray(university?.gallery) && university.gallery.length > 0 && (
        <div className=' rounded-xl p-8 w-full mb-12 px-[75px] max-md:px-[30px]'>
          <h2 className='font-bold text-xl md:text-2xl mb-6'>Gallery</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {university.gallery.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery ${idx + 1}`}
                className='w-full h-40 object-cover rounded-lg shadow-md cursor-pointer'
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
      )}

      {/* video */}
      <VideoSection university={university} />



      {/* image show */}
      {selectedImage && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
          <button
            onClick={() => setSelectedImage(null)}
            className='cursor-pointer'
          >
            <ImCross className=' cursor-pointer absolute right-3 top-7 z-10 text-white sm:text-lg md:text-2xl lg:text-3xl' />
          </button>

          <img
            src={selectedImage}
            alt='Full View'
            className='w-[90%] h-[50%] md:h-[70%] lg:h-[90%] rounded-lg shadow-lg'
          />
        </div>
      )}
    </div>
  )
}

export default ImageSection
