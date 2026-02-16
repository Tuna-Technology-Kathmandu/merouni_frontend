'use client'

import { THEME_BLUE } from '@/constants/constants'
import { cn } from '@/lib/utils'

/**
 * Reusable Action Card Component
 * Used for Login prompts, Success messages, Agent warnings, and "Already Applied" states.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon to display (e.g. GraduationCap, CheckCircle2)
 * @param {string} props.title - Main heading
 * @param {string} [props.subtitle] - Subheading (optional)
 * @param {React.ReactNode} props.description - Description text or element
 * @param {React.ReactNode} props.children - Buttons or other actions
 * @param {string} [props.className] - Additional classes for the container
 * @param {string} [props.variant] - 'default' (split layout with header) or 'centered' (icon on top)
 * @param {string} [props.headerClassName] - Custom class for header
 */
const ActionCard = ({
    icon,
    title,
    subtitle,
    description,
    children,
    className,
    variant = 'default',
    headerClassName
}) => {
    if (variant === 'centered') {
        return (
            <div
                className={cn(
                    'w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center py-16 px-8 transition-all animate-in fade-in zoom-in duration-500',
                    className
                )}
            >
                <div className='flex flex-col items-center justify-center'>
                    {icon && (
                        <div className='w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6'>
                            <div className='w-10 h-10' style={{ color: THEME_BLUE }}>
                                {icon}
                            </div>
                        </div>
                    )}
                    <h2 className='text-3xl font-bold text-gray-800 mb-2'>{title}</h2>
                    {description && (
                        <div className='text-gray-600 max-w-md mx-auto mb-8 text-lg'>
                            {description}
                        </div>
                    )}
                    <div className='flex flex-col sm:flex-row gap-4 items-center justify-center'>
                        {children}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className={cn(
                'w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center',
                className
            )}
        >
            <div
                className={cn('p-8 text-white relative overflow-hidden mb-6', headerClassName)}
                style={{
                    background: `linear-gradient(to right, ${THEME_BLUE}, #2c7a9a)`
                }}
            >
                <div className='relative z-10'>
                    <div className='flex items-center justify-center gap-3 mb-2'>
                        {icon && <div className='w-8 h-8'>{icon}</div>}
                        <h2 className='text-3xl font-bold'>{title}</h2>
                    </div>
                    {subtitle && <p className='text-white/80'>{subtitle}</p>}
                </div>
                {icon && (
                    <div className='absolute -right-8 -bottom-8 opacity-10 [&>svg]:w-40 [&>svg]:h-40'>
                        {icon}
                    </div>
                )}
            </div>
            <div className='p-8 pt-0'>
                {description && <p className='text-gray-600 mb-8'>{description}</p>}
                <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ActionCard
