import React from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { formatDate } from '@/utils/date.util'

const BlogViewModal = ({ isOpen, onClose, data, loading }) => {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-3xl'
        >
            <DialogHeader>
                <DialogTitle>Blog Details</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
            {loading ? (
                <div className='flex justify-center items-center h-48'>
                    Loading...
                </div>
            ) : data ? (
                <div className='space-y-4 overflow-y-auto p-2'>
                    {data.featuredImage && (
                        <div className='w-full h-64 rounded-lg overflow-hidden'>
                            <img
                                src={data.featuredImage}
                                alt={data.title}
                                className='w-full h-full object-cover'
                            />
                        </div>
                    )}

                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            {data.title}
                        </h2>
                        <div className='flex gap-2 mt-2'>
                            {data.status && (
                                <span
                                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${data.status === 'published'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {data.status}
                                </span>
                            )}
                            {data.visibility && (
                                <span
                                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${data.visibility === 'public'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {data.visibility}
                                </span>
                            )}
                        </div>
                    </div>

                    {data.newsCategory && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Category</h3>
                            <p className='text-gray-700'>
                                {data.newsCategory.title}
                            </p>
                        </div>
                    )}

                    {data.newsAuthor && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Author</h3>
                            <p className='text-gray-700'>
                                {data.newsAuthor.firstName}{' '}
                                {data.newsAuthor.middleName}{' '}
                                {data.newsAuthor.lastName}
                            </p>
                        </div>
                    )}

                    {data.tags &&
                        Array.isArray(data.tags) &&
                        data.tags.length > 0 && (
                            <div>
                                <h3 className='text-lg font-semibold mb-2'>Tags</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {data.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                                        >
                                            {typeof tag === 'object' ? tag.title || tag.name : tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    {data.description && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Description</h3>
                            <div
                                className='text-gray-700 prose max-w-none'
                                dangerouslySetInnerHTML={{
                                    __html: data.description
                                }}
                            />
                        </div>
                    )}

                    {data.content && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Content</h3>
                            <div
                                className='text-gray-700 prose prose-sm max-w-none'
                                dangerouslySetInnerHTML={{
                                    __html: data.content
                                }}
                            />
                        </div>
                    )}

                    {data.createdAt && (
                        <div className='pt-4 border-t'>
                            <p className='text-sm text-gray-500'>
                                Created:{' '}
                                {formatDate(data.createdAt)}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <p className='text-center text-gray-500'>No blog data available.</p>
            )}
            <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                <Button
                    type='button'
                    onClick={onClose}
                    variant='outline'
                    size='sm'
                >
                    Close
                </Button>
            </div>
            </DialogContent>
        </Dialog>
    )
}

export default BlogViewModal
