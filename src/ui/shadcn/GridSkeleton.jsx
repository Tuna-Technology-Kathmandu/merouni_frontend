import React from 'react'
import CategoryCardSkeleton from './CategoryCardSkeleton'

const GridSkeleton = ({ count = 8, className, children }) => {
    const content = children || <CategoryCardSkeleton />

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${className}`}>
            {[...Array(count)].map((_, i) => (
                <React.Fragment key={i}>
                    {content}
                </React.Fragment>
            ))}
        </div>
    )
}

export { GridSkeleton }
