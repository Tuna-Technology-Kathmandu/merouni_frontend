import he from 'he'

const SingleExam = ({ exam }) => {
  window.scrollTo(0, 0)

  const data = exam[0]

  if (!data) return <div>No exam data available.</div>

  const decodedContent = data?.description ? he.decode(data.description) : ''

  return (
    <div className='w-full px-6 min-h-screen bg-gradient-to-b from-[#f7fbfc] to-[#e9f3f7] py-10'>
      <div className='max-w-4xl max-[960px]:w-full mx-auto bg-white rounded-2xl custom-shadow p-8'>
        {/* Exam Header */}
        {data.title && (
          <h1 className='text-3xl font-bold text-gray-800 mb-4'>
            {data.title}
          </h1>
        )}

        {decodedContent && (
          <div
            dangerouslySetInnerHTML={{ __html: decodedContent }}
            className='text-gray-800 my-6 leading-7
            [&>iframe]:w-full [&>iframe]:max-w-[calc(100vw-40px)]
            [&>iframe]:aspect-video [&>iframe]:h-auto [&>iframe]:rounded-lg
            [&>iframe]:mt-4 [&>iframe]:mx-auto [&>iframe]:block
            [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse
            [&_th]:bg-gray-100 [&_th]:p-2 [&_th]:text-left [&_th]:border [&_th]:border-gray-300
            [&_td]:p-2 [&_td]:border [&_td]:border-gray-300
            [&_tr:nth-child(even)]:bg-gray-50
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
            text-xs md:text-sm lg:text-base overflow-x-hidden
            [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:my-4 [&_ol]:space-y-2
            [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:my-4 [&_ul]:space-y-2
            [&_li]:pl-2 max-lg:[&_ol]:text-sm max-lg:[&_ul]:text-sm
            max-lg:[&_ol]:space-y-1 max-lg:[&_ul]:space-y-1'
          />
        )}

        {/* Level & University */}
        {(data.level?.title || data.university?.fullname) && (
          <div className='flex flex-wrap gap-2 mb-6'>
            {data.level?.title && (
              <span className='bg-blue-100 text-[#2f6f9c] px-3 py-1 rounded-full text-sm font-medium'>
                {data.level.title}
              </span>
            )}
            {data.university?.fullname && (
              <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
                {data.university.fullname}
              </span>
            )}
          </div>
        )}

        {/* Syllabus */}
        {data.syllabus && (
          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-2 text-gray-700'>
              Syllabus
            </h2>
            <p className='text-gray-600'>{data.syllabus}</p>
          </div>
        )}

        {/* Exam Details */}
        {data.exam_details?.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-4 text-gray-700'>
              Exam Details
            </h2>
            {data.exam_details.map((ed) => (
              <div
                key={ed.id}
                className='bg-gray-50 p-4 rounded-lg mb-3 text-gray-700 text-sm'
              >
                {ed.exam_type && (
                  <div className='flex justify-between mb-1'>
                    <span>Type:</span>
                    <span>{ed.exam_type}</span>
                  </div>
                )}
                {ed.full_marks && (
                  <div className='flex justify-between mb-1'>
                    <span>Full Marks:</span>
                    <span>{ed.full_marks}</span>
                  </div>
                )}
                {ed.pass_marks && (
                  <div className='flex justify-between mb-1'>
                    <span>Pass Marks:</span>
                    <span>{ed.pass_marks}</span>
                  </div>
                )}
                {ed.number_of_question && (
                  <div className='flex justify-between mb-1'>
                    <span>Number of Questions:</span>
                    <span>{ed.number_of_question}</span>
                  </div>
                )}
                {ed.duration && (
                  <div className='flex justify-between'>
                    <span>Duration:</span>
                    <span>{ed.duration}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Application Details */}
        {data.application_details?.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-4 text-gray-700'>
              Application Details
            </h2>
            {data.application_details.map((ad) => (
              <div
                key={ad.id}
                className='bg-gray-50 p-4 rounded-lg mb-3 text-gray-700 text-sm'
              >
                {ad.opening_date && (
                  <div className='flex justify-between mb-1'>
                    <span>Opening Date:</span>
                    <span>{ad.opening_date}</span>
                  </div>
                )}
                {ad.closing_date && (
                  <div className='flex justify-between mb-1'>
                    <span>Closing Date:</span>
                    <span>{ad.closing_date}</span>
                  </div>
                )}
                {ad.exam_date && (
                  <div className='flex justify-between mb-1'>
                    <span>Exam Date:</span>
                    <span>{ad.exam_date}</span>
                  </div>
                )}
                {ad.normal_fee && (
                  <div className='flex justify-between mb-1'>
                    <span>Normal Fee:</span>
                    <span>Rs. {ad.normal_fee}</span>
                  </div>
                )}
                {ad.late_fee && (
                  <div className='flex justify-between'>
                    <span>Late Fee:</span>
                    <span>Rs. {ad.late_fee}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Created */}
        {data.createdAt && (
          <div className='mb-6 text-gray-500 text-sm'>
            <div className='flex gap-4'>
              <div>
                <span className='font-medium'>Posted At:</span>{' '}
                {new Date(data.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Past Question */}
        {data.pastQuestion && (
          <a
            href={data.pastQuestion}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block w-full text-center bg-[#387CAE] hover:bg-[#2f6f9c] text-white px-6 py-3 rounded-lg transition-colors duration-300'
          >
            View Past Question
          </a>
        )}
      </div>
    </div>
  )
}

export default SingleExam
