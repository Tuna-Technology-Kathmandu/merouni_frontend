import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * A premium, reusable image lightbox component.
 * Features: Framer motion animations, glassmorphism close button, 
 * backdrop blur, and scroll locking.
 */
const ImageLightbox = ({ isOpen, onClose, imageUrl, altText }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12 bg-black/95 backdrop-blur-md'
                    onClick={onClose}
                >
                    {/* Refined Close Button */}
                    <button
                        onClick={onClose}
                        className='absolute top-8 right-8 z-[110] group'
                        aria-label='Close gallery'
                    >
                        <div className='p-3 rounded-full bg-white/10 border border-white/20 text-white/70 group-hover:text-white group-hover:bg-white/20 group-hover:rotate-90 transition-all duration-500 shadow-2xl backdrop-blur-xl'>
                            <X size={28} strokeWidth={1.5} />
                        </div>
                    </button>

                    {/* Clean Image Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className='relative w-full h-full flex items-center justify-center'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={imageUrl}
                            alt={altText || 'Gallery preview'}
                            className='max-w-full max-h-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none'
                        />
                    </motion.div>

                    {/* Minimal Caption / Indicator */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className='absolute bottom-10 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs tracking-widest uppercase font-medium backdrop-blur-sm'
                    >
                        Press Esc to Close
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ImageLightbox
