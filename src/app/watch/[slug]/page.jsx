import { getMediaBySlug } from '../../(dashboard)/dashboard/videos/action'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function VideoDetailPage({ params }) {
    const { slug } = params
    const video = await getMediaBySlug(slug)

    if (!video) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
                <Link href="/watch" className="text-blue-600 hover:underline">Return to Watch Page</Link>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <Link href='/watch' className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-6'>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Videos
            </Link>

            <div className='max-w-4xl mx-auto'>
                <div className='aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl mb-8'>
                    <iframe
                        width="100%"
                        height="100%"
                        src={video.yt_video_link?.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>

                <h1 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900'>{video.title}</h1>

                <div className='flex items-center text-gray-500 mb-6 border-b pb-6'>
                    <span className='mr-4'>Published on {new Date(video.createdAt).toLocaleDateString()}</span>
                    {/* Add author or other metadata here if available */}
                </div>

                <div className='prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap'>
                    {video.description}
                </div>
            </div>
        </div>
    )
}
