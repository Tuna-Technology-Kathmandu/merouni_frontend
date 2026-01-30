import GoogleMap from '@/app/colleges/[slugs]/components/GoogleMap'
import { FaMapMarkerAlt } from 'react-icons/fa'

const Description = ({ event }) => {
  const hostData = event?.event_host ? (typeof event.event_host === 'string' ? JSON.parse(event.event_host) : event.event_host) : {}

  const processContent = (html) => {
    if (!html) return ''
    return html.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/g,
      '<div class="table-wrapper"><table$1>$2</table></div>'
    )
  }

  const MetaItem = ({ label, value }) => (
    <div className='flex flex-col border-b border-gray-100 py-4 last:border-0'>
      <span className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>{label}</span>
      <span className='text-base font-medium text-gray-900'>{value || 'N/A'}</span>
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
    <div className='max-w-[1000px] mx-auto px-6 py-12'>
      <div className='flex flex-col lg:flex-row gap-16'>
        {/* Main Content */}
        <div className='flex-1 space-y-12'>
          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>About Event</h2>
            <div
              className='text-gray-600 leading-relaxed text-lg prose prose-gray max-w-none'
              dangerouslySetInnerHTML={{ __html: event?.description }}
            />
          </section>

          {event?.content && (
            <section>
              <div
                className='text-gray-600 leading-relaxed prose prose-gray max-w-none 
                [&_.table-wrapper]:overflow-x-auto
                [&_.table-wrapper]:my-8
                [&_table]:w-full
                [&_table]:border-collapse
                [&_th]:bg-gray-50
                [&_th]:text-left
                [&_th]:font-semibold
                [&_th]:p-4
                [&_th]:text-gray-900
                [&_td]:p-4
                [&_td]:border-t
                [&_td]:border-gray-100'
                dangerouslySetInnerHTML={{ __html: processContent(event?.content) }}
              />
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className='lg:w-80 space-y-10'>
          <div className='bg-gray-50 rounded-2xl p-8'>
            <h3 className='text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-200 pb-4'>Event Details</h3>
            <div className='flex flex-col'>
              <MetaItem label='Host' value={hostData?.host} />
              <MetaItem label='Start Date' value={hostData?.start_date} />
              <MetaItem label='End Date' value={hostData?.end_date} />
              <MetaItem label='Time' value={formatTime(hostData?.time)} />
            </div>
          </div>

          {hostData?.map_url && (
            <div>
              <h3 className='text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2'>
                <FaMapMarkerAlt className='text-gray-400' />
                Location
              </h3>
              <div className='w-full h-56 rounded-2xl overflow-hidden bg-gray-100'>
                <GoogleMap mapUrl={hostData.map_url} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Description
