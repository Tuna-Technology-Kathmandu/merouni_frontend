import Link from 'next/link'
import RelatedCard from './RelatedCard'
import { formatDate } from '@/utils/date.util'

const SmallCardList = ({ blogs }) => {
  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...'
    }
    return str
  }



  return (
    <div className=''>
      <h1 className='text-2xl text-center font-bold mb-7'>Related Blogs</h1>
      <div className='w-full grid grid-cols-4 gap-7 max-[1265px]:grid-cols-3 max-[795px]:grid-cols-2 max-[513px]:grid-cols-1 '>
        {blogs.map((blog) => (
          <Link href={`/blogs/${blog.slug}`} key={blog.id}>
            <RelatedCard
              image={blog.featured_image || 'https://placehold.co/600x400'}
              date={formatDate(blog.createdAt)}
              description={truncateString(blog.description, 100)}
              title={truncateString(blog.title, 20)}
              key={blog.id}
              slug={blog.slug}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
export default SmallCardList
