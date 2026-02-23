import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)
dayjs.extend(isToday)
dayjs.extend(isYesterday)

/**
 * Smart contextual date formatter.
 *
 * • Same day        →  "Today, 2:30 PM"
 * • Yesterday       →  "Yesterday, 9:00 AM"
 * • Within 7 days   →  "3 days ago"
 * • Older           →  "12 Jan 2026"
 */
export const formatDate = (value) => {
  if (!value) return '—'
  const d = dayjs(value)
  if (d.isToday()) return `Today, ${d.format('h:mm A')}`
  if (d.isYesterday()) return `Yesterday, ${d.format('h:mm A')}`
  if (dayjs().diff(d, 'day') < 7) return d.fromNow()
  return d.format('D MMM YYYY')
}

/**
 * Always shows the full date + time  →  "12 Jan 2026, 2:30 PM"
 */
export const formatDateTime = (value) => {
  if (!value) return '—'
  return dayjs(value).format('D MMM YYYY, h:mm A')
}

/**
 * Pure relative time  →  "3 hours ago"
 */
export const formatRelative = (value) => {
  if (!value) return '—'
  return dayjs(value).fromNow()
}

/**
 * Returns { label, title } where:
 *   label  →  smart contextual (from formatDate)
 *   title  →  full "12 Jan 2026, 2:30 PM" for the browser tooltip
 *
 * Usage:  <span title={r.title}>{r.label}</span>
 */
export const formatRelativeWithTitle = (value) => {
  if (!value) return { label: '—', title: '' }
  return {
    label: formatDate(value),
    title: formatDateTime(value)
  }
}

/**
 * Short numeric date  →  "12/01/2026"
 */
export const formatShortDate = (value) => {
  if (!value) return '—'
  return dayjs(value).format('DD/MM/YYYY')
}

/**
 * ISO date string  →  "2026-01-12"  (for <input type="date"> defaultValue)
 */
export const formatISODate = (value) => {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD')
}
