import GoogleMap from '@/app/colleges/[slugs]/components/GoogleMap'
import { FaMapMarkerAlt, FaCalendarCheck, FaClock, FaUserTie } from 'react-icons/fa'

const Description = ({ event }) => {
  const hostData = event?.event_host ? (typeof event.event_host === 'string' ? JSON.parse(event.event_host) : event.event_host) : {}

  const processContent = (html) => {
    if (!html) return ''
    return html.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/g,
      '<div class="table-wrapper"><table$1>$2</table></div>'
    )
  }

  const MetaItem = ({ icon: Icon, label, value }) => (
    <div className='flex items-start gap-4 py-4 border-b border-gray-50 last:border-0'>
      <div className='p-2 rounded-lg bg-blue-50 text-[#0A6FA7]'>
        {Icon && <Icon size={16} />}
      </div>
      <div className='flex flex-col'>
        <span className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5'>{label}</span>
        <span className='text-sm font-semibold text-gray-800 leading-snug'>{value || 'N/A'}</span>
      </div>
    </div>
  )

  const formatTime = (time) => {
    if (!time) return 'N/A'
    try {
      return new Date(`1970-01-01T${time}:00`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    } catch (e) {
      return time
    }
  }

  return (
    <div className='max-w-[1000px] mx-auto px-6 py-12 lg:py-20'>
      <div className='flex flex-col lg:flex-row gap-12 lg:gap-20'>
        {/* Main Content */}
        <div className='flex-1 min-w-0'>
          <div className='space-y-12'>
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3'>
                <span className='w-1.5 h-8 bg-[#0A6FA7] rounded-full'></span>
                About This Event
              </h2>
              <div
                className='prose prose-lg prose-slate max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-[#0A6FA7] prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl'
                dangerouslySetInnerHTML={{ __html: event?.description }}
              />
            </section>

            {event?.content && (
              <section>
                <div
                  className='prose prose-lg prose-slate max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-a:text-[#0A6FA7] prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl
                  [&_.table-wrapper]:overflow-x-auto
                  [&_.table-wrapper]:my-8
                  [&_.table-wrapper]:rounded-xl
                  [&_.table-wrapper]:border
                  [&_.table-wrapper]:border-gray-100
                  [&_table]:w-full
                  [&_table]:border-collapse
                  [&_th]:bg-gray-50
                  [&_th]:text-left
                  [&_th]:font-semibold
                  [&_th]:p-4
                  [&_th]:text-gray-900
                  [&_td]:p-4
                  [&_td]:border-t
                  [&_td]:border-gray-50
                  [&_td]:text-sm'
                  dangerouslySetInnerHTML={{ __html: processContent(event?.content) }}
                />
              </section>
            )}
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div className='lg:w-80 shrink-0 space-y-8'>
          <div className='bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 p-6 lg:p-8 sticky top-28'>
            <h3 className='text-lg font-bold text-gray-900 mb-6 flex items-center gap-2'>
              Event Details
            </h3>

            <div className='flex flex-col'>
              <MetaItem icon={FaUserTie} label='Host' value={hostData?.host} />
              <MetaItem icon={FaCalendarCheck} label='Run Time' value={`${hostData?.start_date || 'N/A'} - ${hostData?.end_date || 'N/A'}`} />
              <MetaItem icon={FaClock} label='Time' value={formatTime(hostData?.time)} />
            </div>

            {hostData?.map_url && (
              <div className='mt-8 pt-8 border-t border-gray-100'>
                <h3 className='text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2'>
                  <FaMapMarkerAlt className='text-[#0A6FA7]' />
                  Location
                </h3>
                <div className='w-full h-48 rounded-xl overflow-hidden border border-gray-100 shadow-sm'>
                  <GoogleMap mapUrl={hostData.map_url} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Description
