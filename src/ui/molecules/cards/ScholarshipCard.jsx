'use client'

import Link from 'next/link'

const formatAmount = (amount) => {
  if (!amount) return null
  const num = parseFloat(amount)
  return Number.isNaN(num) ? amount : `Rs. ${num.toLocaleString()}`
}

const formatDeadline = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const ScholarshipCard = ({ scholarship, onApply, isApplying }) => {
  const amountDisplay = formatAmount(scholarship.amount)
  const deadlineDisplay = formatDeadline(scholarship.applicationDeadline)

  return (
    <article className='bg-white rounded-xl border border-gray-100 p-5 flex flex-col hover:border-gray-200 hover:shadow-sm transition-all duration-200'>
      <h2 className='text-base font-semibold text-gray-900 line-clamp-2 mb-2'>
        {scholarship.name}
      </h2>
      {amountDisplay && (
        <p className='text-sm text-gray-600 mb-3'>{amountDisplay}</p>
      )}
      {deadlineDisplay && (
        <p className='text-xs text-gray-400 mb-4'>
          Deadline: {deadlineDisplay}
        </p>
      )}
      <div className='mt-auto flex gap-2 pt-3 border-t border-gray-50'>
        <Link
          href={`/scholarship/${scholarship.slugs || scholarship.id}`}
          className='flex-1 py-2 rounded-lg text-center text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors'
        >
          View
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault()
            onApply?.(scholarship.id)
          }}
          disabled={isApplying}
          className='flex-1 py-2 rounded-lg text-sm font-medium text-white bg-[#0A6FA7] hover:bg-[#085a86] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
      </div>
    </article>
  )
}

export default ScholarshipCard
