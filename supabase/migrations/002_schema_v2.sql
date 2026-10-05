-- Phase 3 & 4: Production Architecture & RLS
-- Run this in your Supabase SQL Editor

-- 1. Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    identifier VARCHAR UNIQUE,
    role VARCHAR NOT NULL DEFAULT 'citizen', -- 'citizen', 'collection_worker', 'sanitation_worker', 'admin'
    email VARCHAR,
    ward VARCHAR,
    zone VARCHAR,
    team VARCHAR,
    shift VARCHAR,
    vehicle VARCHAR,
    badge_number VARCHAR,
    permissions TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Drop the old users table if it exists (since we're moving to profiles)
DROP TABLE IF EXISTS public.users CASCADE;

-- 3. Update FKs in existing tables to point to profiles instead of users
-- For citizen_requests
ALTER TABLE public.citizen_requests DROP CONSTRAINT IF EXISTS citizen_requests_citizen_id_fkey;
ALTER TABLE public.citizen_requests ADD CONSTRAINT citizen_requests_citizen_id_fkey FOREIGN KEY (citizen_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.citizen_requests DROP CONSTRAINT IF EXISTS citizen_requests_assigned_worker_id_fkey;
ALTER TABLE public.citizen_requests ADD CONSTRAINT citizen_requests_assigned_worker_id_fkey FOREIGN KEY (assigned_worker_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- For task_history
ALTER TABLE public.task_history DROP CONSTRAINT IF EXISTS task_history_worker_id_fkey;
ALTER TABLE public.task_history ADD CONSTRAINT task_history_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- For notifications
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5. Force schema cache reload (Resolves 'Could not find the table in the schema cache')
NOTIFY pgrst, 'reload schema';
