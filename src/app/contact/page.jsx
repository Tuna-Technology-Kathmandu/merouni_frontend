'use client'

import ContactHeroSection from './components/HeroSection'
import ContactNewsletter from './components/ContactNewsLetter'
import Header from '../components/Frontpage/Header'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import ContactInfoCard from './components/ContactInfoCard'
import ContactMap from './components/ContactMap'
import ContactForm from './components/ContactForm'

export default function ContactPage() {
  return (
    <>
      <Header />
      <Navbar />
      <main className='w-full'>
        {/* Hero Section */}
        <ContactHeroSection />

        {/* Contact Forms Section */}
        <section className='py-16 bg-white'>
          <div className='container mx-auto px-4'>
            <div className='grid md:grid-cols-3 gap-8'>
              {/* Main Contact Form */}
              <ContactForm />

              {/* Newsletter Form */}
              <ContactNewsletter />
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <ContactInfoCard />

        {/* Map Section */}
        <ContactMap />
      </main>
      <Footer />
    </>
  )
}
