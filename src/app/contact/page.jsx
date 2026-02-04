'use client'

import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import ContactForm from './components/ContactForm'
import ContactSidebar from './components/ContactSidebar'
import ContactHeroSection from './components/HeroSection'

export default function ContactPage() {
  return (
    <>
      <Header />
      <Navbar />
      <main className='w-full bg-[#fcfcfc]'>
        {/* Hero Section */}
        <ContactHeroSection />

        {/* Content Section */}
        <section className='pb-20 pt-10'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Contact Form - Takes up 2 columns on large screens */}
              <div className='lg:col-span-2'>
                <ContactForm />
              </div>

              {/* Sidebar - Takes up 1 column */}
              <div className='lg:col-span-1'>
                <ContactSidebar />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
