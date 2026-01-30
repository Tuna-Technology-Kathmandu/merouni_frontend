'use client'
import { useEffect, useState } from 'react'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import { getVacancy } from '../actions'
import VacancyContent from './components/VacancyContent'

const ShowVacancy = ({ params }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchdataDetails = async () => {
      try {
        setLoading(true)
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        const vacancyData = await getVacancy(slugs)
        setData(vacancyData.item)
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
        <main className='flex items-center justify-center min-h-screen bg-white'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A6FA7]'></div>
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
          <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl'>
            <p className='font-bold'>Error loading vacancy</p>
            <p className='text-sm mt-1'>{error}</p>
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
        <main className='container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>Vacancy Not Found</h1>
            <p className='text-gray-500'>The vacancy you are looking for does not exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <Navbar />
      <VacancyContent vacancy={data} />
      <Footer />
    </>
  )
}
export default ShowVacancy
