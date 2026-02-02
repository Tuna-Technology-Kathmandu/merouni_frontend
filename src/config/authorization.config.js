export const APP_ROLES = {
  admin: 'admin',
  editor: 'editor',
  agent: 'agent',
  student: 'student',
  institution: 'institution',
  consultancy: 'consultancy'
}

export const PERMISSIONS_VIA_ROLE = {
  [APP_ROLES.admin]: [
    '/dashboard',
    '/dashboard/insights',
    '/dashboard/addCollege',
    '/dashboard/category',
    '/dashboard/events',
    '/dashboard/faculty',
    '/dashboard/media',
    '/dashboard/blogs',
    '/dashboard/news',
    '/dashboard/profile',
    '/dashboard/program',
    '/dashboard/scholarship',
    '/dashboard/university',
    '/dashboard/users',
    '/dashboard/agent',
    '/dashboard/agentApprove',
    '/dashboard/exams',
    '/dashboard/courses',
    '/dashboard/banner',
    '/dashboard/referrals',
    '/dashboard/material',
    '/dashboard/consultancy',
    '/dashboard/career',
    '/dashboard/vacancy',
    '/dashboard/college-rankings',
    '/dashboard/college-orderings',
    '/dashboard/degrees',
    '/dashboard/level',
    '/dashboard/tag',
    '/dashboard/set-referral-point',
    '/dashboard/discipline',
    '/dashboard/skill-based-courses',
    '/dashboard/videos'

  ],
  [APP_ROLES.editor]: [
    '/dashboard',
    '/dashboard/insights',
    '/dashboard/addCollege',
    '/dashboard/college-orderings',
    '/dashboard/courses',
    '/dashboard/exams',
    '/dashboard/banner',
    '/dashboard/category',
    '/dashboard/events',
    '/dashboard/faculty',
    '/dashboard/media',
    '/dashboard/blogs',
    '/dashboard/profile',
    '/dashboard/program',
    '/dashboard/scholarship',
    '/dashboard/university',
    '/dashboard/users',
    '/dashboard/agent',
    '/dashboard/career',
    '/dashboard/consultancy',
    '/dashboard/degrees',
    '/dashboard/level',
    '/dashboard/tag',
    '/dashboard/material',
    '/dashboard/news',
    '/dashboard/vacancy',
    '/dashboard/referrals',
    
  ],
  [APP_ROLES.agent]: [
    '/dashboard/referStudent',
    '/dashboard/referedStudents',
    '/dashboard/profile'
  ],
  [APP_ROLES.student]: [
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/referrals',
    '/dashboard/applied-scholarships'
  ],
  [APP_ROLES.institution]: [
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/applications',
    '/dashboard/edit-college'
  ],
  [APP_ROLES.consultancy]: [
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/consultancy',
  ]
}
