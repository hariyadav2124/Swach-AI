import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { MOCK_ACCOUNTS } from '../src/data/mockAccounts.js';

dotenv.config({ path: resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function seedAuthAndProfiles() {
  console.log("Seeding Auth Users and Profiles...");
  
  for (const acc of MOCK_ACCOUNTS) {
    const emailLogin = acc.email || `${acc.identifier.replace(/\s+/g, '')}@swachai.com`;
    const password = acc.password || acc.otpCode || 'password123';

    console.log(`Creating user: ${emailLogin}`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailLogin,
      password: password,
    });

    if (authError) {
      console.warn(`Auth Error for ${emailLogin}:`, authError.message);
      // Might already exist or email unconfirmed. We ignore and proceed.
    }

    // Since we don't have service role, we try to insert profile IF auth succeeded and returned session, 
    // OR if we can log in. Let's log in to get session.
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: emailLogin,
      password: password
    });

    if (loginError || !loginData.session) {
      console.warn(`Login failed for ${emailLogin}:`, loginError?.message);
      continue;
    }

    console.log(`Upserting profile for ${emailLogin} (ID: ${loginData.session.user.id})`);
    
    // We are logged in as the user, so RLS (auth.uid() = id) allows us to insert/update our own profile!
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: loginData.session.user.id,
      identifier: acc.identifier,
      name: acc.name,
      role: acc.role,
      email: acc.email,
      ward: acc.ward,
      zone: acc.zone,
      team: acc.team || null,
      shift: acc.shift || null,
      vehicle: acc.vehicle || null,
      badge_number: acc.badgeNumber || null,
      permissions: acc.permissions || []
    }, { onConflict: 'id' });

    if (profileError) {
      console.error(`Profile Error for ${emailLogin}:`, profileError.message);
    } else {
      console.log(`Success: ${emailLogin}`);
    }

    await supabase.auth.signOut();
  }
  
  console.log("Seeding complete.");
}

seedAuthAndProfiles();
