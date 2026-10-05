-- SwachAI Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('CITIZEN', 'COLLECTION_WORKER', 'SANITATION_WORKER', 'MUNICIPAL_ADMIN');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'SUSPENDED', 'DISABLED');
CREATE TYPE bin_status AS ENUM ('normal', 'filling', 'critical', 'serviced');
CREATE TYPE request_type AS ENUM ('complaint', 'cleaning', 'new_bin');
CREATE TYPE request_status AS ENUM ('submitted', 'assigned', 'in_progress', 'resolved', 'rejected', 'escalated');
CREATE TYPE notification_type AS ENUM ('critical_bin', 'request_update', 'cleaning_assigned', 'review', 'task_assigned', 'critical', 'route_update', 'equipment', 'vehicle', 'sla_breach', 'prediction', 'complaint');

-- 2. TABLES

-- Users / Accounts Table (Custom profiles linked to auth, or standalone for this mock setup)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR NOT NULL UNIQUE, -- Phone, Employee ID, or Admin ID
    name VARCHAR NOT NULL,
    role user_role NOT NULL,
    status account_status DEFAULT 'ACTIVE',
    ward VARCHAR,
    zone VARCHAR,
    team VARCHAR,
    shift VARCHAR,
    vehicle VARCHAR,
    badge_number VARCHAR,
    email VARCHAR,
    password_hash VARCHAR,
    otp_code VARCHAR,
    permissions TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Bins
CREATE TABLE bins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    sector VARCHAR NOT NULL,
    location_description TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    status bin_status DEFAULT 'normal',
    fill_level INTEGER DEFAULT 0,
    capacity_liters INTEGER NOT NULL,
    sensor_battery INTEGER DEFAULT 100,
    ward VARCHAR NOT NULL,
    last_collection TIMESTAMPTZ,
    last_cleaning TIMESTAMPTZ,
    predicted_critical_time TIMESTAMPTZ,
    prediction_reason TEXT,
    bin_types TEXT[], -- e.g. ['dry', 'wet']
    active_reports_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citizen Requests (Complaints, New Bins, Cleaning)
CREATE TABLE citizen_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type request_type NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    issue_category VARCHAR,
    status request_status DEFAULT 'submitted',
    bin_id UUID REFERENCES bins(id) ON DELETE SET NULL,
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_worker_id UUID REFERENCES users(id) ON DELETE SET NULL,
    location TEXT,
    sector VARCHAR,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    photo_url TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks History (Collection & Sanitation logs)
CREATE TABLE task_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_id UUID REFERENCES bins(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_type VARCHAR NOT NULL, -- 'collection' or 'sanitation'
    status VARCHAR NOT NULL,
    quantity_kg DOUBLE PRECISION,
    actions_performed TEXT[], -- for sanitation
    operator_notes TEXT,
    before_photo TEXT,
    after_photo TEXT,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Null means broadcast
    type notification_type NOT NULL,
    title VARCHAR NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_bin_id UUID REFERENCES bins(id) ON DELETE CASCADE,
    related_request_id UUID REFERENCES citizen_requests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS (Row Level Security) - Optional but recommended for production
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Examples of basic policies (to be tuned based on exact auth setup)
-- Allow read access to all authenticated users for bins
CREATE POLICY "Allow public read of bins" ON bins FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access to bins" ON bins FOR ALL USING (true);
CREATE POLICY "Allow authenticated full access to users" ON users FOR ALL USING (true);
CREATE POLICY "Allow authenticated full access to citizen_requests" ON citizen_requests FOR ALL USING (true);
CREATE POLICY "Allow authenticated full access to task_history" ON task_history FOR ALL USING (true);
CREATE POLICY "Allow authenticated full access to notifications" ON notifications FOR ALL USING (true);
