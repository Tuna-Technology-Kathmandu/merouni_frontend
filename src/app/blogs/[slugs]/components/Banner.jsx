import { useEffect, useState } from 'react'
import { getBanner } from '../../action'

const Banner = () => {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBanner(1, 3) // Set page & limit here
        setBanners(data.items) // Adjust based on API structure
        console.log('abnenrData', data)
      } catch (err) {
        console.error('Error loading banners', err)
      }
    }

    fetchData()
  }, [])
  console.log('banners', banners)
  return (
    <div className='min-w-[100px] flex flex-col gap-6 max-[1016px]:hidden'>
      <div className='w-[100px] h-[400px] bg-slate-200 rounded-md overflow-hidden relative'>
        <img
          src='/images/meroUniLarge.gif'
          alt='Rotated Banner'
          className='absolute top-0 left-0 w-[400px] h-[100px] transform rotate-90 origin-top-left object-fill'
        />
      </div>
      <div className='w-[100px] h-[400px] bg-slate-200 rounded-md overflow-hidden relative'>
        <img
          src='/images/meroUniLarge.gif'
          alt='Rotated Banner'
          className='absolute top-0 left-0 w-[400px] h-[100px] transform rotate-90 origin-top-left object-fill'
        />
      </div>
    </div>
  )
}
export default Banner
