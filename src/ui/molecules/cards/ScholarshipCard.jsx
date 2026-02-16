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

  const isExpired = scholarship.applicationDeadline
    ? new Date(scholarship.applicationDeadline) < new Date()
    : false

  return (
    <article className='bg-white rounded-xl border border-gray-100 p-5 flex flex-col hover:border-gray-200 hover:shadow-sm transition-all duration-200'>
      <div className='flex justify-between items-start mb-2'>
        <h2 className='text-base font-semibold text-gray-900 line-clamp-2'>
          {scholarship.name}
        </h2>
        {isExpired && (
          <span className='px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 uppercase tracking-wider'>
            Expired
          </span>
        )}
      </div>
      {amountDisplay && (
        <p className='text-sm text-gray-600 mb-3'>{amountDisplay}</p>
      )}
      {deadlineDisplay && (
        <p className={`text-xs mb-4 ${isExpired ? 'text-red-400' : 'text-gray-400'}`}>
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
          disabled={isApplying || isExpired}
          className={`flex-1 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isExpired ? 'bg-gray-300' : 'bg-[#0A6FA7] hover:bg-[#085a86]'
            }`}
        >
          {isApplying ? 'Applying...' : isExpired ? 'Expired' : 'Apply'}
        </button>
      </div>
    </article>
  )
}

export default ScholarshipCard
