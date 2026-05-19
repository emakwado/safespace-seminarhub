# 🛡️ Safespace SeminarHub

A production-ready full-stack monorepo for modern seminar management — featuring booking, registration, attendance tracking, anonymous feedback, attendee recommendations, and administrative analytics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Security](#security)
- [License](#license)

## ✨ Features

### Authentication & Authorization
- JWT-based authentication with access & refresh tokens
- Role-based access control (Super Admin, Organizer, Attendee)
- Email verification & password reset
- Secure password hashing with bcrypt

### Seminar Management
- Full CRUD operations for seminars
- Publish/unpublish workflow
- Image upload support
- Speaker profiles & venue management
- Capacity management with real-time seat tracking
- Categories & tags

### Registration & Ticketing
- Online registration with approval workflow
- Digital tickets with unique QR codes
- Email confirmations via Nodemailer
- Registration history & cancellation

### Attendance Tracking
- QR code check-in/check-out
- Real-time attendance dashboard
- Present/absent/late statistics
- Attendance history per user

### Anonymous Feedback & Messages
- Anonymous seminar feedback & ratings
- Anonymous concern reporting
- Admin review & response system
- Feedback analytics

### Recommendation System
- Share referral links
- Email invitations
- Click & conversion tracking
- Top recommended seminars

### Admin Dashboard
- User analytics
- Registration trends
- Attendance statistics
- Feedback summaries
- Seminar performance metrics
- Audit logs

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 (App Router) | React framework |
| React 18 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Framer Motion | Animations |
| React Hook Form + Zod | Form validation |
| TanStack Query | Data fetching |
| Recharts | Analytics charts |
| QRCode.react | QR code generation |
| Zustand | State management |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | API framework |
| TypeScript | Type safety |
| PostgreSQL | Database |
| TypeORM | ORM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email service |
| Helmet | Security headers |
| CORS | Cross-origin requests |
| Express Rate Limit | Rate limiting |
| Winston | Logging |
| Zod/Joi | Validation |

## 📁 Project Structure

```
safespace-seminarhub/
├── frontend/                    # Next.js 14 frontend
│   ├── app/                     # App Router pages
│   │   ├── login/               # Authentication pages
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── seminars/            # Seminar listing & detail
│   │   ├── dashboard/           # User dashboard
│   │   └── admin/               # Admin panel
│   ├── components/              # React components
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service layer
│   ├── store/                   # Zustand stores
│   ├── types/                   # TypeScript types
│   └── lib/                     # Utilities
├── backend/                     # Express.js backend
│   ├── src/
│   │   ├── config/              # Configuration
│   │   ├── controllers/         # Route controllers
│   │   ├── entities/            # TypeORM entities
│   │   ├── middleware/          # Express middleware
│   │   ├── migrations/          # Database migrations
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Utilities
│   │   └── validators/          # Zod validators
│   └── package.json
├── vercel.json                  # Vercel deployment config
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safespace-seminarhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend
   cp frontend/.env.local.example frontend/.env.local
   ```

4. **Set up the database**
   ```bash
   cd backend
   npm run migration:run
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # From root
   npm run dev

   # Or separately
   npm run dev:backend   # Port 5000
   npm run dev:frontend  # Port 3000
   ```

### Default Accounts (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@safespace.com | Admin@123 |
| Organizer | organizer@safespace.com | Organizer@123 |
| Attendee | attendee@safespace.com | Attendee@123 |

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/safespace_seminarhub
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Safespace SeminarHub
```

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/forgot-password | Request password reset |
| POST | /api/auth/reset-password | Reset password |
| GET | /api/auth/verify-email | Verify email |
| GET | /api/auth/profile | Get profile |
| PATCH | /api/auth/profile | Update profile |

### Seminars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/seminars | List seminars |
| GET | /api/seminars/:id | Get seminar by ID |
| GET | /api/seminars/slug/:slug | Get seminar by slug |
| POST | /api/seminars | Create seminar |
| PUT | /api/seminars/:id | Update seminar |
| DELETE | /api/seminars/:id | Delete seminar |
| PATCH | /api/seminars/:id/publish | Publish seminar |
| PATCH | /api/seminars/:id/unpublish | Unpublish seminar |
| GET | /api/seminars/stats | Seminar statistics |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/registrations | Create registration |
| GET | /api/registrations | List registrations |
| GET | /api/registrations/my-registrations | My registrations |
| PATCH | /api/registrations/:id/status | Update status |
| DELETE | /api/registrations/:id/cancel | Cancel registration |
| GET | /api/registrations/export/:seminarId | Export attendees |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/attendance/checkin | Check in |
| POST | /api/attendance/checkout | Check out |
| GET | /api/attendance/stats | Attendance stats |
| GET | /api/attendance/seminar/:seminarId | Seminar attendance |
| GET | /api/attendance/my-attendance | My attendance |

### Feedback
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/feedback | Submit feedback |
| GET | /api/feedback | List feedback |
| GET | /api/feedback/stats | Feedback stats |
| GET | /api/feedback/seminar/:seminarId | Seminar feedback |
| PATCH | /api/feedback/:id | Update feedback |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/recommendations | Create recommendation |
| GET | /api/recommendations | List recommendations |
| GET | /api/recommendations/stats | Referral stats |
| GET | /api/recommendations/track/:code | Track click |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/dashboard | Dashboard stats |
| GET | /api/analytics/users | User analytics |
| GET | /api/analytics/seminars | Seminar analytics |
| GET | /api/analytics/attendance | Attendance analytics |

## 🗄️ Database Schema

### Entities
- **User** - Authentication & profile data
- **Seminar** - Seminar information
- **Registration** - User registrations
- **Attendance** - Check-in/check-out records
- **Feedback** - Ratings & anonymous reports
- **Recommendation** - Referral tracking
- **AuditLog** - Activity logging
- **Notification** - User notifications

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with `vercel.json` configuration

The `vercel.json` routes `/api/*` to the backend and all other traffic to the frontend.

### Manual Deployment
```bash
# Build
npm run build

# Start production
npm start
```

## 🔒 Security

- **Helmet** - Secure HTTP headers
- **CORS** - Configured cross-origin policies
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Zod schema validation
- **SQL Injection Prevention** - TypeORM parameterized queries
- **XSS Protection** - Data sanitization
- **Password Hashing** - bcrypt with salt rounds
- **JWT Security** - Short-lived access tokens, refresh token rotation
- **Audit Logging** - Comprehensive activity tracking

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ by the Safespace SeminarHub Team
