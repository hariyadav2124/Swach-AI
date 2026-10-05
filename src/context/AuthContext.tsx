import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthSession, UserRole } from '../types/auth';

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  signIn: (identifier: string, passOrOtp: string, channel: 'citizen' | 'staff' | 'admin') => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        fetchAndSetProfile(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
      if (supabaseSession) {
        fetchAndSetProfile(supabaseSession.user.id);
      } else {
        setSession(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAndSetProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      if (data) {
        setSession({
          authenticated: true,
          userId: data.id,
          role: data.role as UserRole,
          name: data.name,
          identifier: data.identifier,
          status: 'ACTIVE',
          ward: data.ward || '',
          zone: data.zone || '',
          team: data.team || '',
          vehicle: data.vehicle || '',
          shift: data.shift || '',
          badgeNumber: data.badge_number || '',
          email: data.email || '',
          permissions: data.permissions || [],
          loginTimestamp: Date.now()
        });
      }
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (identifier: string, passOrOtp: string, channel: 'citizen' | 'staff' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      // For this implementation, we assume identifier is an email for Auth, 
      // or we use a custom approach. Supabase requires email or phone for signInWithPassword.
      // Since SwachAI uses identifiers like '+91 9876543210' or 'ADM-0014', 
      // we need to resolve it to an email if we didn't use a custom Auth provider.
      // For demonstration in this architecture, we will append a dummy domain to non-email identifiers
      // so Supabase Auth can process them via standard Email/Password.
      const emailLogin = identifier.includes('@') ? identifier : `${identifier.replace(/\s+/g, '')}@swachai.local`;
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: emailLogin,
        password: passOrOtp // Using the OTP or password field as the password
      });

      if (authError) {
        throw new Error(authError.message);
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
