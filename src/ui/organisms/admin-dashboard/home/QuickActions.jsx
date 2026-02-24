'use client'

import React from 'react'
import Link from 'next/link'
import {
  Calendar,
  Newspaper,
  FileText,
  School,
  GraduationCap,
  Book,
  Trophy,
  Pen,
  Briefcase,
  ClipboardList
} from 'lucide-react'

const QuickActions = () => {
  const actions = [
    {
      href: '/dashboard/events?add=true',
      label: 'Add Event',
      icon: Calendar,
      colorClasses: {
        container: 'hover:bg-blue-50 hover:border-blue-300',
        iconBg: 'bg-blue-100 group-hover:bg-blue-200',
        iconColor: 'text-blue-600',
        textHover: 'group-hover:text-blue-600'
      }
    },
    {
      href: '/dashboard/blogs?add=true',
      label: 'Add Blog',
      icon: Newspaper,
      colorClasses: {
        container: 'hover:bg-green-50 hover:border-green-300',
        iconBg: 'bg-green-100 group-hover:bg-green-200',
        iconColor: 'text-green-600',
        textHover: 'group-hover:text-green-600'
      }
    },
    {
      href: '/dashboard/material?add=true',
      label: 'Add Material',
      icon: FileText,
      colorClasses: {
        container: 'hover:bg-purple-50 hover:border-purple-300',
        iconBg: 'bg-purple-100 group-hover:bg-purple-200',
        iconColor: 'text-purple-600',
        textHover: 'group-hover:text-purple-600'
      }
    },
    {
      href: '/dashboard/colleges?add=true',
      label: 'Add College',
      icon: School,
      colorClasses: {
        container: 'hover:bg-orange-50 hover:border-orange-300',
        iconBg: 'bg-orange-100 group-hover:bg-orange-200',
        iconColor: 'text-orange-600',
        textHover: 'group-hover:text-orange-600'
      }
    },
    {
      href: '/dashboard/program?add=true',
      label: 'Add Program',
      icon: GraduationCap,
      colorClasses: {
        container: 'hover:bg-indigo-50 hover:border-indigo-300',
        iconBg: 'bg-indigo-100 group-hover:bg-indigo-200',
        iconColor: 'text-indigo-600',
        textHover: 'group-hover:text-indigo-600'
      }
    },
    {
      href: '/dashboard/courses?add=true',
      label: 'Add Course',
      icon: Book,
      colorClasses: {
        container: 'hover:bg-teal-50 hover:border-teal-300',
        iconBg: 'bg-teal-100 group-hover:bg-teal-200',
        iconColor: 'text-teal-600',
        textHover: 'group-hover:text-teal-600'
      }
    },
    {
      href: '/dashboard/scholarship?add=true',
      label: 'Add Scholarships',
      icon: Trophy,
      colorClasses: {
        container: 'hover:bg-yellow-50 hover:border-yellow-300',
        iconBg: 'bg-yellow-100 group-hover:bg-yellow-200',
        iconColor: 'text-yellow-600',
        textHover: 'group-hover:text-yellow-600'
      }
    },
    {
      href: '/dashboard/exams?add=true',
      label: 'Add Exams',
      icon: Pen,
      colorClasses: {
        container: 'hover:bg-pink-50 hover:border-pink-300',
        iconBg: 'bg-pink-100 group-hover:bg-pink-200',
        iconColor: 'text-pink-600',
        textHover: 'group-hover:text-pink-600'
      }
    },
    {
      href: '/dashboard/consultancy?add=true',
      label: 'Add Consultancy',
      icon: Briefcase,
      colorClasses: {
        container: 'hover:bg-red-50 hover:border-red-300',
        iconBg: 'bg-red-100 group-hover:bg-red-200',
        iconColor: 'text-red-600',
        textHover: 'group-hover:text-red-600'
      }
    },
    {
      href: '/dashboard/vacancy?add=true',
      label: 'Add Vacancy',
      icon: ClipboardList,
      colorClasses: {
        container: 'hover:bg-slate-50 hover:border-slate-300',
        iconBg: 'bg-slate-100 group-hover:bg-slate-200',
        iconColor: 'text-slate-600',
        textHover: 'group-hover:text-slate-600'
      }
    }
  ]

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>
        Quick Actions
      </h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center gap-3 p-4 border border-gray-200 rounded-lg transition-colors group ${action.colorClasses.container}`}
            >
              <div className={`p-2 rounded-lg transition-colors ${action.colorClasses.iconBg}`}>
                <Icon className={`w-5 h-5 ${action.colorClasses.iconColor}`} />
              </div>
              <span className={`text-sm font-medium text-gray-700 ${action.colorClasses.textHover}`}>
                {action.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
