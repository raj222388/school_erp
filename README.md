# 🎓 SchoolERP Pro - School Management System

A full production-ready school management system built with **Next.js 14**, **Supabase**, **Tailwind CSS**, and **QR Code generation**.

---

## 🚀 Features

- 🔐 **Secure Admin Login** — Supabase Auth with protected routes
- 👨‍🎓 **Student Management** — Add, view, search, delete students with photo uploads
- 👨‍🏫 **Teacher Management** — Add, view, search, delete teachers with photo uploads
- 📱 **Digital ID Cards** — Beautiful public profile pages at `/student/[id]` and `/teacher/[id]`
- 🔲 **QR Code System** — Auto-generated permanent QR codes linking to profile pages
- ⬇️ **QR Download** — Download QR codes as PNG files
- 🖼️ **Image Upload** — Upload student/teacher/parent photos to Supabase Storage
- 🔍 **Search** — Search students and teachers by name, class, school
- 📊 **Dashboard** — Stats overview with total students and teachers
- 📱 **Responsive** — Mobile-friendly sidebar dashboard layout
- 🎨 **Premium UI** — Dark glassmorphism design with animations

---

## 📋 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14 | React framework with App Router |
| TypeScript | 5 | Type safety |
| Supabase | Latest | Database, Auth & Storage |
| Tailwind CSS | 3 | Styling |
| qrcode | Latest | QR code generation |
| react-hot-toast | Latest | Toast notifications |
| lucide-react | Latest | Icons |
| uuid | Latest | UUID generation |

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
cd school-erp
npm install
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Go to **SQL Editor** → **New Query**
3. Paste and run the entire contents of `supabase-schema.sql`
4. Go to **Authentication** → **Users** → **Add User**
5. Create your admin account with email + password

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find your credentials at:
- **Supabase Dashboard** → **Settings** → **API**

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Login
Go to `/login` and sign in with the admin credentials you created in Supabase.

---

## 📁 Project Structure

```
school-erp/
├── app/
│   ├── layout.tsx              # Root layout with toast provider
│   ├── page.tsx                # Redirects to /admin or /login
│   ├── globals.css             # Global styles + design system
│   ├── not-found.tsx           # Custom 404 page
│   ├── login/
│   │   └── page.tsx            # Admin login page
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout (auth guard + sidebar)
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── students/
│   │   │   ├── page.tsx        # Students list page
│   │   │   └── new/page.tsx    # Add student form
│   │   ├── teachers/
│   │   │   ├── page.tsx        # Teachers list page
│   │   │   └── new/page.tsx    # Add teacher form
│   │   └── settings/
│   │       └── page.tsx        # Update admin credentials
│   ├── student/
│   │   └── [id]/page.tsx       # Public student ID card
│   └── teacher/
│       └── [id]/page.tsx       # Public teacher ID card
├── components/
│   ├── Sidebar.tsx             # Responsive sidebar navigation
│   ├── QRCodeDisplay.tsx       # QR code with download
│   ├── ImageUpload.tsx         # Drag & drop image upload
│   └── ConfirmDelete.tsx       # Delete confirmation modal
├── lib/
│   └── supabase/
│       ├── client.ts           # Client-side Supabase client
│       └── server.ts           # Server-side Supabase client
├── types/
│   └── index.ts                # TypeScript type definitions
├── middleware.ts               # Route protection middleware
├── supabase-schema.sql         # Database + storage schema
├── .env.example                # Environment variables template
└── next.config.js              # Next.js configuration
```

---

## 🗄️ Database Schema

### `students` table
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key (permanent, never changes) |
| name | TEXT | Student's full name |
| photo_url | TEXT | URL to profile photo in Supabase Storage |
| father_name | TEXT | Father's full name |
| father_photo | TEXT | URL to father's photo |
| mother_name | TEXT | Mother's full name |
| mother_photo | TEXT | URL to mother's photo |
| father_phone | TEXT | Father's phone number |
| mother_phone | TEXT | Mother's phone number |
| address | TEXT | Student's home address |
| school_name | TEXT | School name |
| school_phone | TEXT | School phone number |
| school_address | TEXT | School address |
| class_name | TEXT | Class/grade name |
| class_teacher | TEXT | Class teacher's name |
| created_at | TIMESTAMPTZ | Auto-set on creation |

### `teachers` table
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key (permanent, never changes) |
| name | TEXT | Teacher's full name |
| photo_url | TEXT | URL to profile photo |
| experience | TEXT | Years of teaching experience |
| qualification | TEXT | Educational qualification |
| school_name | TEXT | Current school |
| address | TEXT | Teacher's home address |
| school_address | TEXT | School's address |
| created_at | TIMESTAMPTZ | Auto-set on creation |

---

## 🔲 QR Code System

Each student and teacher gets a **permanent QR code** that encodes:
- Students: `/student/{UUID}`
- Teachers: `/teacher/{UUID}`

The QR code **never changes** because it uses the UUID as the identifier, and the UUID is generated once at creation time.

QR codes are downloadable as PNG from:
1. The admin list pages (click QR icon)
2. The public profile pages

---

## 🔐 Security

- All admin routes (`/admin/*`) are protected by middleware
- Server-side auth check in admin layout
- Supabase RLS policies: public can only **read**, only authenticated admins can **write/delete**
- Storage policies match the same pattern

---

## 🌐 Deployment (Production)

### Vercel (Recommended)
```bash
npm run build
```
Then deploy to Vercel and add environment variables in the Vercel dashboard.

**Update `.env.local` for production:**
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Environment Variables for Production
Set these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

---

## 📱 Usage Guide

1. **Login** at `/login` with admin credentials
2. **Dashboard** shows total students and teachers
3. **Add Student** — Fill form with photos, family info, school info
4. **Add Teacher** — Fill form with photo, qualifications, school info
5. **View QR** — Click the QR icon in the list to view and download
6. **Public Profile** — Click the eye icon to view the public ID card
7. **Delete** — Click trash icon with confirmation dialog
8. **Settings** — Update admin email or password

---

Built with ❤️ by SchoolERP Pro
