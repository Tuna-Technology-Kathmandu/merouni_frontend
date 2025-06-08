import Link from 'next/link'
import RelatedCard from './RelatedCard'

const SmallCardList = ({ news }) => {
  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...'
    }
    return str
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  return (
    <div className=''>
      <h1 className='text-xl font-bold mb-7'>Related Blogs</h1>
      <div className='w-full flex gap-7 flex-wrap justify-center'>
        {news.map((blog) => (
          <Link href={`/blogs/${blog.slug}`} key={blog.id}>
            <RelatedCard
              image={blog.featuredImage || 'https://placehold.co/600x400'}
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
