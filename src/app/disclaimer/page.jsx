'use client'

import React from 'react'
import Header from '@/components/Frontpage/Header'
import Navbar from '@/components/Frontpage/Navbar'
import Footer from '@/components/Frontpage/Footer'
import { getConfigByType } from '../actions/siteConfigActions'

const Disclaimer = () => {
    const [content, setContent] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchContent = async () => {
            try {
                const config = await getConfigByType('legal_disclaimer')
                if (config?.config) {
                    setContent(config.config.value)
                }
            } catch (error) {
                console.error('Failed to fetch disclaimer:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchContent()
    }, [])

    return (
        <>
            <Header />
            <Navbar />
            <div className='min-h-screen bg-white'>
                <div className='max-w-[800px] mx-auto px-6 py-16 lg:py-24'>
                    <h1 className='text-3xl lg:text-4xl font-black text-gray-900 mb-8'>Disclaimer</h1>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <div
                            className='space-y-8 text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none'
                            dangerouslySetInnerHTML={{ __html: content || '<p>No disclaimer content available.</p>' }}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Disclaimer
