'use client'

import React from 'react'
import Header from '@/components/Frontpage/Header'
import Navbar from '@/components/Frontpage/Navbar'
import Footer from '@/components/Frontpage/Footer'

const Disclaimer = () => {
    return (
        <>
            <Header />
            <Navbar />
            <div className='min-h-screen bg-white'>
                <div className='max-w-[800px] mx-auto px-6 py-16 lg:py-24'>
                    <h1 className='text-3xl lg:text-4xl font-black text-gray-900 mb-8'>Disclaimer</h1>

                    <div className='space-y-8 text-gray-600 leading-relaxed text-lg'>
                        <p>
                            The information provided on <strong>Mero Uni</strong> is for general informational purposes only.
                            All information on the site is provided in good faith, however we make no representation or warranty
                            of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability,
                            or completeness of any information on the site.
                        </p>

                        <section>
                            <h2 className='text-xl font-bold text-gray-800 mb-3'>External Links Disclaimer</h2>
                            <p>
                                The site may contain (or you may be sent through the site) links to other websites or content belonging
                                to or originating from third parties. Such external links are not investigated, monitored, or checked
                                for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-xl font-bold text-gray-800 mb-3'>Educational Information Disclaimer</h2>
                            <p>
                                The educational information provided is not intended as a substitute for professional advice.
                                Before taking any actions based upon such information, we encourage you to consult with the appropriate
                                professionals. We do not provide any kind of educational advice.
                            </p>
                        </section>

                        <p className='text-sm text-gray-400 pt-8 border-t border-gray-100'>
                            Last updated: January 2026
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Disclaimer
