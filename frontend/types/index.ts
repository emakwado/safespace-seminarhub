export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: "super_admin" | "organizer" | "attendee"
  avatar?: string
  status: string
  emailVerified: boolean
  createdAt: string
}

export interface Speaker {
  name: string
  bio: string
  avatar?: string
  title?: string
  company?: string
}

export interface Seminar {
  id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  image?: string
  venue: string
  venueAddress?: string
  startDate: string
  endDate: string
  capacity: number
  registeredCount: number
  attendedCount: number
  status: "draft" | "published" | "cancelled" | "completed"
  category: string
  tags?: string[]
  speakers?: Speaker[]
  isOnline: boolean
  onlineLink?: string
  price: number
  requiresApproval: boolean
  organizer: User
  organizerId: string
  createdAt: string
  updatedAt: string
  availableSeats: number
  isFull: boolean
  isUpcoming: boolean
  isOngoing: boolean
  isPast: boolean
}

export interface Registration {
  id: string
  userId: string
  user: User
  seminarId: string
  seminar: Seminar
  status: "pending" | "approved" | "rejected" | "cancelled" | "waitlist"
  ticketNumber: string
  qrCode?: string
  notes?: string
  checkedInAt?: string
  checkedOutAt?: string
  createdAt: string
}

export interface Feedback {
  id: string
  userId?: string
  user?: User
  seminarId: string
  seminar: Seminar
  type: string
  rating?: number
  content: string
  isAnonymous: boolean
  isReport: boolean
  speakerName?: string
  isResolved: boolean
  adminResponse?: string
  createdAt: string
}

export interface Attendance {
  id: string
  registrationId: string
  seminarId: string
  seminar: Seminar
  userId: string
  user: User
  status: string
  checkInTime: string
  checkOutTime?: string
  scannedBy?: string
  deviceId?: string
  location?: string
}

export interface DashboardStats {
  users: {
    total: number
    organizers: number
    attendees: number
  }
  seminars: {
    total: number
    published: number
    upcoming: number
  }
  registrations: {
    total: number
    approved: number
    pending: number
    approvalRate: number
  }
  feedback: {
    total: number
    reports: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
