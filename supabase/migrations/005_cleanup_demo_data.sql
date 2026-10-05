-- 005_cleanup_demo_data.sql
-- Run this script in the Supabase SQL Editor to clear all demo data

-- Delete demo users from public.profiles
-- This deletes the 4 users inserted in 004_seed_demo_data.sql
-- We identify them by their known emails/identifiers
DELETE FROM public.profiles 
WHERE email IN (
  'aman.sharma@example.com',
  'rohit.kumar@sasnagar.gov.in',
  'neha.verma@sasnagar.gov.in',
  'priya.mehta@sasnagar.gov.in'
);

-- Delete any existing application records to start fresh
DELETE FROM public.notifications;
DELETE FROM public.task_history;
DELETE FROM public.citizen_requests;
DELETE FROM public.bins;

-- NOTE: If you manually inserted the demo users into auth.users (as per 004), 
-- you should also delete them from auth.users via the Supabase Dashboard, 
-- or using the SQL below (requires caution):
DELETE FROM auth.users 
WHERE email IN (
  'aman.sharma@example.com',
  'rohit.kumar@sasnagar.gov.in',
  'neha.verma@sasnagar.gov.in',
  'priya.mehta@sasnagar.gov.in'
);
