'use client'

import { ProgressProvider as BProgress } from '@bprogress/next/app'
import {THEME_BLUE } from "@/constants/constants"

export default function BProgressProvider({ children }) {
    return (
        <BProgress
            height='2px'
            color={THEME_BLUE}
            options={{
                showSpinner: false,
                easing: 'ease',
                speed: 500,
            }}
            shallowRouting
        >
            {children}
        </BProgress>
    )
}
