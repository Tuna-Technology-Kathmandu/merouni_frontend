import { fetchVideos } from '../(dashboard)/dashboard/videos/action'
import VideoList from './VideoList'

export const dynamic = 'force-dynamic'

export default async function WatchPage() {
    const data = await fetchVideos(1, 100)

    return (
        <>
            <div className='container mx-auto px-4 py-8'>
                <h1 className='text-3xl font-bold mb-8 text-center text-gray-800'>
                    Watch Our Latest Videos
                </h1>
                <VideoList initialData={data} />
            </div>

        </>
    )
}
