-- FINAL PRODUCTION SCHEMA (Safe Migration)

-- 1. UTILITY FUNCTIONS FOR RLS
-- SECURITY DEFINER bypasses RLS, preventing infinite recursion when checking user roles
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    identifier VARCHAR UNIQUE,
    role VARCHAR NOT NULL DEFAULT 'CITIZEN',
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

-- 3. SAFELY MIGRATE FOREIGN KEYS
-- Drop FKs first so that existing application data in these tables is NOT cascaded away
ALTER TABLE IF EXISTS public.citizen_requests DROP CONSTRAINT IF EXISTS citizen_requests_citizen_id_fkey;
ALTER TABLE IF EXISTS public.citizen_requests DROP CONSTRAINT IF EXISTS citizen_requests_assigned_worker_id_fkey;
ALTER TABLE IF EXISTS public.task_history DROP CONSTRAINT IF EXISTS task_history_worker_id_fkey;
ALTER TABLE IF EXISTS public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- We can now safely drop the obsolete users table without touching other tables' data
DROP TABLE IF EXISTS public.users CASCADE;

-- Add constraints pointing to the new profiles table
ALTER TABLE public.citizen_requests ADD CONSTRAINT citizen_requests_citizen_id_fkey FOREIGN KEY (citizen_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.citizen_requests ADD CONSTRAINT citizen_requests_assigned_worker_id_fkey FOREIGN KEY (assigned_worker_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.task_history ADD CONSTRAINT task_history_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES (Idempotent Drops followed by Creates)

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
CREATE POLICY "Users can view own profile or admins view all" ON public.profiles FOR SELECT USING (
    auth.uid() = id OR public.get_user_role() = 'MUNICIPAL_ADMIN'
);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- BINS
DROP POLICY IF EXISTS "Bins are viewable by authenticated users" ON public.bins;
CREATE POLICY "Bins are viewable by authenticated users" ON public.bins FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can insert bins" ON public.bins;
CREATE POLICY "Admins can insert bins" ON public.bins FOR INSERT WITH CHECK (public.get_user_role() = 'MUNICIPAL_ADMIN');

DROP POLICY IF EXISTS "Staff can update bins" ON public.bins;
CREATE POLICY "Staff can update bins" ON public.bins FOR UPDATE USING (
    public.get_user_role() IN ('MUNICIPAL_ADMIN', 'COLLECTION_WORKER', 'SANITATION_WORKER')
);

DROP POLICY IF EXISTS "Admins can delete bins" ON public.bins;
CREATE POLICY "Admins can delete bins" ON public.bins FOR DELETE USING (public.get_user_role() = 'MUNICIPAL_ADMIN');

-- CITIZEN REQUESTS
DROP POLICY IF EXISTS "Citizens view own requests, staff view all" ON public.citizen_requests;
CREATE POLICY "Citizens view own requests, staff view all" ON public.citizen_requests FOR SELECT USING (
    auth.uid() = citizen_id OR public.get_user_role() IN ('MUNICIPAL_ADMIN', 'COLLECTION_WORKER', 'SANITATION_WORKER')
);

DROP POLICY IF EXISTS "Citizens can insert requests" ON public.citizen_requests;
CREATE POLICY "Citizens can insert requests" ON public.citizen_requests FOR INSERT WITH CHECK (auth.uid() = citizen_id);

DROP POLICY IF EXISTS "Staff can update requests" ON public.citizen_requests;
CREATE POLICY "Staff can update requests" ON public.citizen_requests FOR UPDATE USING (
    public.get_user_role() IN ('MUNICIPAL_ADMIN', 'COLLECTION_WORKER', 'SANITATION_WORKER')
);

-- TASK HISTORY
DROP POLICY IF EXISTS "Workers view own tasks, admins view all" ON public.task_history;
CREATE POLICY "Workers view own tasks, admins view all" ON public.task_history FOR SELECT USING (
    auth.uid() = worker_id OR public.get_user_role() = 'MUNICIPAL_ADMIN'
);

DROP POLICY IF EXISTS "Workers can insert tasks" ON public.task_history;
CREATE POLICY "Workers can insert tasks" ON public.task_history FOR INSERT WITH CHECK (auth.uid() = worker_id);

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (
    user_id IS NULL OR user_id = auth.uid() OR public.get_user_role() = 'MUNICIPAL_ADMIN'
);

DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT WITH CHECK (
    public.get_user_role() = 'MUNICIPAL_ADMIN'
);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (
    user_id = auth.uid()
);

-- 6. STORAGE BUCKET (report-images)
INSERT INTO storage.buckets (id, name, public) VALUES ('report-images', 'report-images', false) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Users can view own images, staff can view all" ON storage.objects;
CREATE POLICY "Users can view own images, staff can view all" ON storage.objects FOR SELECT USING (
    bucket_id = 'report-images' AND (
        name LIKE 'reports/' || auth.uid()::text || '/%' OR
        public.get_user_role() IN ('MUNICIPAL_ADMIN', 'COLLECTION_WORKER', 'SANITATION_WORKER')
    )
);

DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
CREATE POLICY "Users can upload their own images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'report-images' AND 
    auth.role() = 'authenticated' AND 
    name LIKE 'reports/' || auth.uid()::text || '/%'
);

-- 7. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
