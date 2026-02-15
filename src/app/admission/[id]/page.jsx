'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  FileText, 
  Info, 
  ArrowLeft,
  Calendar,
  Wallet,
  Building2,
  ChevronRight
} from 'lucide-react'
import Navbar from '../../../components/Frontpage/Navbar'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import { getAdmissionDetail } from '../actions'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'
import Link from 'next/link'

const AdmissionDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [admission, setAdmission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true)
      try {
        const data = await getAdmissionDetail(id)
        setAdmission(data)
      } catch (error) {
        console.error('Error fetching admission detail:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchDetail()
  }, [id])

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="min-h-screen bg-gray-50/50 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg mb-8" />
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100">
              <div className="flex flex-col gap-6">
                <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="h-32 bg-gray-100 animate-pulse rounded-3xl" />
                  <div className="h-32 bg-gray-100 animate-pulse rounded-3xl" />
                </div>
                <div className="h-64 bg-gray-50 animate-pulse rounded-3xl mt-8" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!admission) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admission Details Not Found</h1>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#0A6FA7] font-semibold hover:underline mx-auto"
            >
              <ArrowLeft size={18} /> Back to Admissions
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <Navbar />
      <main className="min-h-screen bg-gray-50/50 py-12 px-6 font-sans">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb / Back Link */}
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0A6FA7] transition-colors mb-8"
          >
            <div className="p-2 rounded-full bg-white shadow-sm border border-gray-100 group-hover:border-[#0A6FA7]/20 group-hover:bg-[#0A6FA7]/5 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to Admissions
          </button>

          {/* Hero Section Card */}
          <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-10 relative">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={admission.collegeAdmissionCollege?.featured_img || '/images/logo.png'} 
                alt="College background" 
                className="w-full h-full object-cover opacity-10"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-blue-50/50" />
            </div>

            <div className="relative p-8 md:p-12 lg:p-16 z-10">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none hidden md:block">
                <GraduationCap size={240} className="text-[#0A6FA7]" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0A6FA7] text-xs font-bold uppercase tracking-widest mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A6FA7] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A6FA7]"></span>
                  </span>
                  Admission Open
                </div>

                <h1 className="text-2xl md:text-1xl lg:text-2xl font-extrabold text-gray-900 leading-tight mb-6 max-w-3xl">
                  {admission.program?.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-4 gap-x-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">College</p>
                      <Link 
                        href={`/colleges/${admission.collegeAdmissionCollege?.slugs}`}
                        className="text-base font-bold text-[#0A6FA7] hover:underline"
                      >
                        {admission.collegeAdmissionCollege?.name}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Affiliation</p>
                      <p className="text-base font-bold text-gray-700">
                        {admission.collegeAdmissionCollege?.university?.fullname || 'Not Specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-gray-50/80 border-t border-gray-100 px-8 py-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             

                           
            </div>
          </div>

          {/* Details Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-10">
              {/* Description Section */}
              <section className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-1 bg-[#0A6FA7] rounded-full" />
                  <h2 className="text-2xl font-bold text-gray-900">Program Overview</h2>
                </div>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed font-medium">
                  {admission.description ? (
                    <div dangerouslySetInnerHTML={{ __html: admission.description }} />
                  ) : (
                    <p>No detailed description provided for this program's admission. Please contact the college for more comprehensive information regarding the course structure and curriculum.</p>
                  )}
                </div>
              </section>

              {/* Eligibility Section */}
              <section className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-1 bg-[#0A6FA7] rounded-full" />
                  <h2 className="text-2xl font-bold text-gray-900">Eligibility Criteria</h2>
                </div>
                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-50">
                  <div className="flex gap-4">
                    <div className="p-3 bg-white rounded-xl text-[#0A6FA7] shadow-sm shrink-0 h-fit">
                      <FileText size={24} />
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {admission.eligibility_criteria || 'Eligibility criteria vary by program. Generally requires completion of higher secondary education or equivalent with specific grade requirements.'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Admission Process Section */}
              <section className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-1 bg-[#0A6FA7] rounded-full" />
                  <h2 className="text-2xl font-bold text-gray-900">Admission Process</h2>
                </div>
                <div className="space-y-6">
                   <p className="text-gray-600 font-medium leading-relaxed">
                     {admission.admission_process || 'Applicants must follow the standard application procedure conducted by the college.'}
                   </p>
                   
                 
                </div>
              </section>
            </div>

            {/* Sidebar / Sidebar CTA */}
            <div className="lg:col-span-4 space-y-8">
              {/* College Card Short */}
              <div className="bg-[#0A6FA7] rounded-[32px] p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Building2 size={180} />
                </div>
                
                <h3 className="text-lg font-bold mb-2">Interested in this College?</h3>
                <p className="text-blue-100/80 text-sm mb-8 font-medium">Get in touch with the college administration for more details on this program.</p>
                
                <Link 
                  href={`/colleges/${admission.collegeAdmissionCollege?.slugs}`}
                  className="w-full bg-white text-[#0A6FA7] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                >
                  View College Profile
                  <ChevronRight size={18} />
                </Link>
              </div>

              {/* Quick Links / Navigation */}
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Required Documents</h3>
                <ul className="space-y-4">
                  {[
                    'Academic Certificates',
                    'Citizenship / ID Proof',
                    'Passport Size Photos',
                    'Migration Certificate'
                  ].map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0A6FA7]" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default AdmissionDetailPage
