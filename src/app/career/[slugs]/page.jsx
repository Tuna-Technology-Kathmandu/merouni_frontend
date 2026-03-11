'use client'
import { THEME_BLUE } from '@/constants/constants'
import ActionCard from '@/ui/molecules/ActionCard'
import { Button } from '@/ui/shadcn/button'
import { formatDate } from '@/utils/date.util'
import { Briefcase, Calendar, CheckCircle2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import { getCareer } from '../actions'
import ApplyCareerModal from '../components/ApplyCareerModal'

const ShowCareer = ({ params }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const router = useRouter()
  const user = useSelector((state) => state.user?.data)

  const processContent = (html) => {
    if (!html) return ''
    return html.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/g,
      '<div class="table-wrapper"><table$1>$2</table></div>'
    )
  }

  useEffect(() => {
    const fetchdataDetails = async () => {
      try {
        setLoading(true)
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        const careerData = await getCareer(slugs)
        setData(careerData.item)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchdataDetails()
  }, [params])

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <main className='container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <Navbar />
        <main className='container mx-auto px-4 py-8 min-h-[60vh]'>
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            <p>Error loading career: {error}</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!data) {
    return (
      <>
        <Header />
        <Navbar />
        <main className='container mx-auto px-4 py-8 min-h-[60vh]'>
          <p>Career not found</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-1 pb-20">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link
            href="/career"
            className="inline-flex items-center text-gray-500 hover:text-[#0A6FA7] mb-6 transition-colors text-sm font-semibold bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Careers
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header Area inside Card */}
            <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-[#0A6FA7]/10 text-[#0A6FA7] text-[10px] font-bold rounded-full mb-3 uppercase tracking-widest">
                    {
                      data?.status === 'open' ? 'Open Position' : 'Closed Position'
                    }
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                    {data?.title ?? ''}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Posted {formatDate(data?.createdAt)}</span>
                    </div>
                  
                  </div>
                </div>

                <div className="flex-shrink-0 mt-2 md:mt-0 flex flex-col md:flex-row gap-3 min-w-max">
                  {data?.status === 'inactive' ? (
                    <button
                      disabled
                      className="px-6 py-2.5 bg-gray-200 text-gray-500 rounded-lg font-semibold text-sm cursor-not-allowed"
                    >
                      Expired
                    </button>
                  ) : data?.hasApplied ? (
                    <button
                      disabled
                      className="px-6 py-2.5 bg-green-50 text-green-600 border border-green-200 rounded-lg font-semibold text-sm cursor-not-allowed"
                    >
                      Already Applied
                    </button>
                  ) : user && (
                    <button
                      onClick={() => setApplyModalOpen(true)}
                      className="px-6 py-2.5 bg-[#0A6FA7] text-white rounded-lg font-semibold text-sm hover:bg-[#0A6FA7]/90 hover:shadow shadow-sm transition-all"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Body Area */}
            <div className="p-6 md:p-8">
              {data.featuredImage && (
                <div className="mb-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                  <img
                    src={data.featuredImage}
                    alt={data.title || 'Career'}
                    className="w-full max-h-[300px] object-cover"
                  />
                </div>
              )}

              {data?.description && (
                <div className="mb-10 pb-10 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
                    Position Overview
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {data.description}
                  </p>
                </div>
              )}

              <div className="prose prose-base max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-a:text-[#0A6FA7] prose-a:no-underline hover:prose-a:underline prose-li:marker:text-[#0A6FA7] prose-ul:pt-1
                /* Table wrapper styles */
                 [&_.table-wrapper]:overflow-x-auto
                 [&_.table-wrapper]:my-6
                 [&_.table-wrapper]:w-full
                 [&_.table-wrapper]:rounded-lg
                 [&_.table-wrapper]:border
                 [&_.table-wrapper]:border-gray-200
    
                 /* Table styles */
                 [&_table]:min-w-full
                 [&_table]:border-collapse
                 [&_th]:bg-gray-50
                 [&_th]:p-3
                 [&_th]:text-left
                 [&_th]:font-semibold
                 [&_th]:text-sm
                 [&_th]:text-gray-900
                 [&_th]:border-b
                 [&_th]:border-gray-200
                 [&_td]:p-3
                 [&_td]:text-sm
                 [&_td]:border-b
                 [&_td]:border-gray-200
                 [&_tr:last-child_td]:border-0
                 [&_tr:nth-child(even)]:bg-gray-50/50"
                dangerouslySetInnerHTML={{ __html: processContent(data?.content) }}
              />

              <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col items-center text-center bg-gray-50/50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 rounded-b-2xl">
                {data?.status === 'inactive' ? (
                  <div className="w-full max-w-2xl mx-auto py-4">
                    <ActionCard
                      variant='centered'
                      icon={<CheckCircle2 className='w-full h-full text-gray-400' />}
                      title='Position Closed'
                      description={
                        <>
                          We are no longer accepting applications for{' '}
                          <span className='font-semibold text-gray-900'>
                            {data?.title || 'this role'}
                          </span>
                          .
                        </>
                      }
                    />
                  </div>
                ) : data?.hasApplied ? (
                  <div className="w-full max-w-2xl mx-auto py-4">
                    <ActionCard
                      variant='centered'
                      icon={<CheckCircle2 className='w-full h-full text-green-500' />}
                      title='Application Submitted'
                      description={
                        <>
                          You have already submitted an application for{' '}
                          <span className='font-semibold text-gray-900'>
                            {data?.title || 'this role'}
                          </span>
                          .
                        </>
                      }
                    />
                  </div>
                ) : user ? (
                  <>
                    <div className="w-12 h-12 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mb-4">
                      <Briefcase className="w-6 h-6 text-[#0A6FA7]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                      Ready to join our team?
                    </h3>
                    <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
                      If you think you're a good fit for this position, we'd love to hear from you.
                    </p>
                    <button
                      onClick={() => setApplyModalOpen(true)}
                      className="px-8 py-3 bg-[#0A6FA7] text-white rounded-lg font-semibold text-sm hover:bg-[#0A6FA7]/90 shadow-sm transition-all"
                    >
                      Submit Application
                    </button>
                  </>
                ) : (
                  <div className="w-full max-w-2xl mx-auto py-4">
                    <ActionCard
                      variant='centered'
                      icon={<CheckCircle2 className='w-full h-full text-blue-500' />}
                      title='Sign in to Apply'
                      description={
                        <>
                          Please login or create an account to submit your application for{' '}
                          <span className='font-semibold text-gray-900'>
                            {data?.title || 'this role'}
                          </span>
                          .
                        </>
                      }
                    >
                      <Link href='/sign-in'>
                        <Button
                          variant='outline'
                          className='min-w-[160px] h-12 text-base font-medium'
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href='/sign-in'>
                        <Button
                          className='min-w-[160px] h-12 text-base font-medium text-white shadow-md'
                          style={{ backgroundColor: THEME_BLUE }}
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </ActionCard>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ApplyCareerModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        careerId={data.id}
        careerTitle={data.title}
      />

      <ToastContainer />

      <Footer />
    </div>
  )
}
export default ShowCareer
