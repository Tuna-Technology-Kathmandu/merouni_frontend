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
  console.log('banners', banners)
  return (
    <div className='min-w-[80px] max-[855px]:min-w-[40px] flex flex-col gap-6 '>
      <img
        src='/images/meroUniLarge.gif'
        alt='Rotated Banner'
        className='absolute top-[770px] w-[400px] h-[80px] -right-28 max-[855px]:h-[60px] max-[855px]:-right-36 max-[770px]:top-[750px] max-[640px]:top-[530px] max-[640px]:-right-24 max-[640px]:w-[300px] max-[400px]:h-[40px] object-fill rotate-90  z-10'
      />
      <img
        src='/images/meroUniLarge.gif'
        alt='Rotated Banner'
        className='absolute top-[1200px] w-[400px] h-[80px] -right-28 max-[855px]:h-[60px] max-[855px]:-right-36 max-[768px]:top-[1200px] max-[640px]:top-[900px] max-[640px]:-right-24 max-[640px]:w-[300px] max-[400px]:h-[40px] object-fill rotate-90  z-10'
      />
    </div>
  )
}
export default Banner
