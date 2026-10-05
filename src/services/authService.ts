import { supabase } from '../lib/supabase';
import { AuthSession } from '../types/auth';

export const authService = {
  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;
    
    // Fetch profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).single();
    
    if (!profile) return null;

    return {
      authenticated: true,
      userId: profile.id,
      role: profile.role,
      name: profile.name,
      identifier: profile.identifier,
      status: 'ACTIVE', // Default from DB
      ward: profile.ward || '',
      zone: profile.zone || '',
      team: profile.team || '',
      vehicle: profile.vehicle || '',
      shift: profile.shift || '',
      badgeNumber: profile.badge_number || '',
      email: profile.email || '',
      permissions: profile.permissions || [],
      loginTimestamp: Date.now()
    };
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }
};
