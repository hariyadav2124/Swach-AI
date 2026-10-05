import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { MOCK_ACCOUNTS } from '../src/data/mockAccounts.js';

// Load .env from project root
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("Seeding users...");

  const users = MOCK_ACCOUNTS.map(acc => ({
    identifier: acc.identifier,
    name: acc.name,
    role: acc.role,
    status: acc.status,
    ward: acc.ward,
    zone: acc.zone,
    team: acc.team || null,
    shift: acc.shift || null,
    vehicle: acc.vehicle || null,
    badge_number: acc.badgeNumber || null,
    email: acc.email || null,
    password_hash: acc.password || null,
    otp_code: acc.otpCode || null,
    permissions: acc.permissions || []
  }));

  const { error } = await supabase.from('users').upsert(users, { onConflict: 'identifier' });

  if (error) {
    console.error("Error seeding users:", error.message);
  } else {
    console.log("Successfully seeded users.");
  }

  // To insert bins, complaints, etc., we can add them here if mock data had any.
  // Since they are empty, we just seed users for now.
}

seed();
