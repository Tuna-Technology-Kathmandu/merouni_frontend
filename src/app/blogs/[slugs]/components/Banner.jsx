import { useEffect, useState } from 'react'
import { getBanner } from '../../action'

const Banner = () => {
  const [banners, setBanners] = useState([])

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const data = await getBanner(1, 3) // Set page & limit here
  //       setBanners(data.items) // Adjust based on API structure
  //       console.log('abnenrData', data)
  //     } catch (err) {
  //       console.error('Error loading banners', err)
  //     }
  //   }

  //   fetchData()
  // }, [])
  return (
    <div className='min-w-[80px] flex flex-col gap-6  max-[868px]:flex-row max-[868px]:w-full max-[886px]:px-12'>
      <img
        src='/images/meroUniLarge.gif'
        alt='Rotated Banner'
        className='absolute top-[170px] w-[400px] h-[80px] -right-36 object-fill rotate-90 z-10 max-[868px]:static max-[868px]:rotate-0 max-[868px]:z-0
        max-[886px]:w-1/2 max-[886px]:h-[60px] max-[624px]:h-[40px]
        '
      />
      <img
        src='/images/meroUniLarge.gif'
        alt='Rotated Banner'
        className='absolute top-[600px] w-[400px] h-[80px] -right-36 object-fill rotate-90 z-10 max-[868px]:static max-[868px]:rotate-0 max-[868px]:z-0
         max-[886px]:w-1/2 max-[886px]:h-[60px] max-[624px]:h-[40px]
        '
      />
    </div>
  )
}
export default Banner
