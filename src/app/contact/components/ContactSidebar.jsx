'use client'
import React, { useState, useEffect } from 'react'
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react'
import { getSiteConfig } from '@/app/actions/siteConfigActions'

const ContactSidebar = () => {
    const [contactInfo, setContactInfo] = useState({
        phone: '',
        email: '',
        address: ''
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const res = await getSiteConfig({ types: 'contact_phone,contact_email,contact_address' })
                if (res?.items) {
                    const info = {}
                    res.items.forEach(item => {
                        if (item.type === 'contact_phone') info.phone = item.value
                        if (item.type === 'contact_email') info.email = item.value
                        if (item.type === 'contact_address') info.address = item.value
                    })
                    setContactInfo(prev => ({ ...prev, ...info }))
                }
            } catch (error) {
                console.error('Failed to fetch contact info:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchContactInfo()
    }, [])

    const items = [
        {
            icon: Phone,
            label: 'Phone',
            value: contactInfo.phone || '(+977) 9840747576',
            sub: 'Mon-Fri from 9am to 6pm',
            link: `tel:${contactInfo.phone || '+9779840747576'}`
        },
        {
            icon: Mail,
            label: 'Email',
            value: contactInfo.email || 'info@merouni.com',
            sub: 'Online support 24/7',
            link: `mailto:${contactInfo.email || 'info@merouni.com'}`
        },
        {
            icon: MapPin,
            label: 'Office',
            value: contactInfo.address || 'Putalisadak, Kathmandu',
            sub: 'Nepal',
            link: `https://maps.google.com/?q=${contactInfo.address || 'Putalisadak, Kathmandu'}`
        }
    ]

    if (loading) {
        return (
            <div className='flex flex-col gap-6 lg:sticky lg:top-24 h-fit animate-pulse'>
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-64'></div>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-6 lg:sticky lg:top-24 h-fit'>
            <div className='bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100'>
                <h3 className='text-lg font-bold text-gray-900 mb-6'>Contact Information</h3>
                <div className='flex flex-col gap-6'>
                    {items.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className='flex items-start gap-4 group'
                        >
                            <div className='p-3 rounded-lg bg-[#30AD8F]/10 text-[#30AD8F] group-hover:bg-[#30AD8F] group-hover:text-white transition-colors duration-300'>
                                <item.icon size={20} />
                            </div>
                            <div className='flex-1'>
                                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 group-hover:text-[#30AD8F] transition-colors'>
                                    {item.label}
                                </span>
                                <h4 className='text-base font-semibold text-gray-900 leading-snug mb-0.5 break-words'>
                                    {item.value}
                                </h4>
                                <p className='text-sm text-gray-500 font-medium'>
                                    {item.sub}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ContactSidebar
