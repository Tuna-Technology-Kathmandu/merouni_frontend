import React from 'react'
import { THEME_BLUE } from '@/constants/constants'

const CircularLoader = ({ className = '', size = 'w-10 h-10' }) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`${size} border-2 rounded-full animate-spin transition-all duration-300`}
                style={{
                    borderColor: `${THEME_BLUE}20`, // 20 opacity for the track
                    borderTopColor: THEME_BLUE, // full opacity for the spinner
                }}
            ></div>
        </div>
    )
}

export default CircularLoader
