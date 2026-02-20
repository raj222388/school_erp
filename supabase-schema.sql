-- ============================================================
-- SchoolERP Pro - Supabase SQL Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- ============================================================
-- 1. STUDENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  photo_url     TEXT,
  father_name   TEXT NOT NULL DEFAULT '',
  father_photo  TEXT,
  mother_name   TEXT NOT NULL DEFAULT '',
  mother_photo  TEXT,
  father_phone  TEXT NOT NULL DEFAULT '',
  mother_phone  TEXT NOT NULL DEFAULT '',
  address       TEXT NOT NULL DEFAULT '',
  school_name   TEXT NOT NULL DEFAULT '',
  school_phone  TEXT NOT NULL DEFAULT '',
  school_address TEXT NOT NULL DEFAULT '',
  class_name    TEXT NOT NULL DEFAULT '',
  class_teacher TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Public can READ students (for QR profile pages)
CREATE POLICY "Public can read students"
  ON public.students FOR SELECT
  USING (true);

-- Only authenticated admins can INSERT
CREATE POLICY "Authenticated users can insert students"
  ON public.students FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated admins can UPDATE
CREATE POLICY "Authenticated users can update students"
  ON public.students FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated admins can DELETE
CREATE POLICY "Authenticated users can delete students"
  ON public.students FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 2. TEACHERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teachers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  photo_url      TEXT,
  experience     TEXT NOT NULL DEFAULT '',
  qualification  TEXT NOT NULL DEFAULT '',
  school_name    TEXT NOT NULL DEFAULT '',
  address        TEXT NOT NULL DEFAULT '',
  school_address TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Public can READ teachers (for QR profile pages)
CREATE POLICY "Public can read teachers"
  ON public.teachers FOR SELECT
  USING (true);

-- Only authenticated admins can INSERT
CREATE POLICY "Authenticated users can insert teachers"
  ON public.teachers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated admins can UPDATE
CREATE POLICY "Authenticated users can update teachers"
  ON public.teachers FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated admins can DELETE
CREATE POLICY "Authenticated users can delete teachers"
  ON public.teachers FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 3. STORAGE BUCKETS
-- Run these separately in SQL Editor or via Supabase Dashboard
-- ============================================================

-- Create student-photos bucket (set to public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-photos',
  'student-photos',
  true,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create teacher-photos bucket (set to public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'teacher-photos',
  'teacher-photos',
  true,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. STORAGE POLICIES
-- ============================================================

-- Student photos: Public can view
CREATE POLICY "Public can view student photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'student-photos');

-- Student photos: Authenticated can upload
CREATE POLICY "Authenticated can upload student photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'student-photos');

-- Student photos: Authenticated can update
CREATE POLICY "Authenticated can update student photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'student-photos');

-- Student photos: Authenticated can delete
CREATE POLICY "Authenticated can delete student photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'student-photos');

-- Teacher photos: Public can view
CREATE POLICY "Public can view teacher photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'teacher-photos');

-- Teacher photos: Authenticated can upload
CREATE POLICY "Authenticated can upload teacher photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'teacher-photos');

-- Teacher photos: Authenticated can update
CREATE POLICY "Authenticated can update teacher photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'teacher-photos');

-- Teacher photos: Authenticated can delete
CREATE POLICY "Authenticated can delete teacher photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'teacher-photos');

-- ============================================================
-- DONE! Now create your admin user:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Invite user" or "Add user"
-- 3. Enter your admin email and password
-- 4. Use those credentials to log in at /login
-- ============================================================
