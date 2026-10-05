-- 006_create_master_admin.sql
-- Run this in your Supabase SQL Editor to create the auto-confirmed admin account securely.

DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    -- 1. Create the Auth User (Auto-confirmed)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'admin@swachai.in',
        crypt('Admin@123', gen_salt('bf')),
        NOW(), -- This bypasses the email confirmation requirement
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    )
    ON CONFLICT (email) DO NOTHING;

    -- 2. Create the linked application Profile
    -- We select the ID dynamically in case the user already existed
    INSERT INTO public.profiles (
        id,
        name,
        identifier,
        role,
        email,
        permissions
    )
    SELECT 
        id,
        'Executive Administrator',
        'ADMIN-MASTER',
        'MUNICIPAL_ADMIN',
        'admin@swachai.in',
        ARRAY['all_access', 'manage_bins', 'assign_workers', 'resolve_complaints', 'approve_new_bins', 'view_predictions', 'export_reports', 'manage_routes', 'broadcast_alerts']
    FROM auth.users
    WHERE email = 'admin@swachai.in'
    ON CONFLICT (id) DO UPDATE SET 
        role = 'MUNICIPAL_ADMIN',
        permissions = ARRAY['all_access', 'manage_bins', 'assign_workers', 'resolve_complaints', 'approve_new_bins', 'view_predictions', 'export_reports', 'manage_routes', 'broadcast_alerts'];
END $$;
