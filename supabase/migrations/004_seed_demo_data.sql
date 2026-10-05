-- Seed file for Mock Accounts
-- RUN THIS IN SUPABASE SQL EDITOR TO BYPASS EMAIL CONFIRMATION & RATE LIMITS

-- Constants
-- Hash for 'password123'
-- DO NOT USE THIS HASH PATTERN FOR REAL PRODUCTION PASSWORDS.

-- 1. Insert into auth.users
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
  created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES
-- Citizen
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'aman.sharma@example.com', crypt('123456', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
-- Collection Worker
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'rohit.kumar@sasnagar.gov.in', crypt('demo123', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
-- Sanitation Worker
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'neha.verma@sasnagar.gov.in', crypt('demo123', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
-- Admin
('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'priya.mehta@sasnagar.gov.in', crypt('admin123', gen_salt('bf')), now(), now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert into public.profiles
INSERT INTO public.profiles (
  id, name, identifier, role, email, ward, zone, team, shift, vehicle, badge_number, permissions
)
VALUES
(
  '11111111-1111-1111-1111-111111111111', 'Aman Sharma', '+91 9876543210', 'CITIZEN', 'aman.sharma@example.com', '14', 'Sector 68', NULL, NULL, NULL, NULL,
  ARRAY['report_issue', 'request_cleaning', 'request_new_bin', 'view_bins', 'scan_waste', 'track_own_requests']
),
(
  '22222222-2222-2222-2222-222222222222', 'Rohit Kumar', 'CW-1048', 'COLLECTION_WORKER', 'rohit.kumar@sasnagar.gov.in', '14', 'Sector 68', 'Collection Team A', '06:00 AM – 02:00 PM', 'PB-65-AX-4091 (Heavy Compactor)', 'CW-1048',
  ARRAY['view_route', 'complete_collection', 'report_problem', 'update_bin_status', 'view_worker_telemetry']
),
(
  '33333333-3333-3333-3333-333333333333', 'Neha Verma', 'SW-2031', 'SANITATION_WORKER', 'neha.verma@sasnagar.gov.in', '14', 'Sector 68', 'Sanitation Unit B', '07:00 AM – 03:00 PM', 'PB-65-SN-8820 (Disinfection Unit)', 'SW-2031',
  ARRAY['view_sanitation_route', 'log_disinfection', 'escalate_hazard', 'inspect_chemical_levels', 'upload_clean_proof']
),
(
  '44444444-4444-4444-4444-444444444444', 'Priya Mehta', 'ADM-0014', 'MUNICIPAL_ADMIN', 'priya.mehta@sasnagar.gov.in', '14', 'Sectors 68–71', NULL, '07:00 AM – 03:00 PM', NULL, NULL,
  ARRAY['all_access', 'manage_bins', 'assign_workers', 'resolve_complaints', 'approve_new_bins', 'view_predictions', 'export_reports', 'manage_routes', 'broadcast_alerts']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions;
