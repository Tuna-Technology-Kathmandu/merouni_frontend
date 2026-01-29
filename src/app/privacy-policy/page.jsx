'use client'

import React from 'react'
import Header from '@/components/Frontpage/Header'
import Navbar from '@/components/Frontpage/Navbar'
import Footer from '@/components/Frontpage/Footer'

const PrivacyPolicy = () => {
    return (
        <>
            <Header />
            <Navbar />
            <div className='min-h-screen bg-white'>
                <div className='max-w-[800px] mx-auto px-6 py-16 lg:py-24'>
                    <h1 className='text-3xl lg:text-4xl font-black text-gray-900 mb-8'>Privacy Policy</h1>

                    <div className='space-y-8 text-gray-600 leading-relaxed text-lg'>
                        <p>
                            At <strong>Mero Uni</strong>, we are committed to protecting your privacy. This Privacy Policy explains
                            how we collect, use, and safeguard your personal information when you visit our website.
                        </p>

                        <section>
                            <h2 className='text-xl font-bold text-gray-800 mb-3'>Information We Collect</h2>
                            <p>
                                We may collect personal information that you voluntarily provide to us when you register on the website,
                                express an interest in obtaining information about us or our products and services, when you participate
                                in activities on the website, or otherwise when you contact us.
                            </p>
                        </section>

                        <section>
                            <h2 className='text-xl font-bold text-gray-800 mb-3'>How We Use Your Information</h2>
                            <ul className='list-disc pl-5 space-y-2'>
                                <li>To provide and maintain our service</li>
                                <li>To notify you about changes to our service</li>
                                <li>To allow you to participate in interactive features</li>
                                <li>To provide customer support</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className='text-xl font-bold text-gray-800 mb-3'>Data Security</h2>
                            <p>
                                We value your trust in providing us your Personal Information, thus we are striving to use commercially
                                acceptable means of protecting it. But remember that no method of transmission over the internet is 100% secure.
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

export default PrivacyPolicy
