'use client'

import { ProgressProvider as BProgress } from '@bprogress/next/app'

export default function BProgressProvider({ children }) {
    return (
        <BProgress
            height='4px'
            color='#387cae'
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
