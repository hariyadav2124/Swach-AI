import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CommunityBin, CitizenRequest, CivicNotification } from '../types';
import { AuthSession } from '../types/auth';

interface SupabaseContextType {
  bins: CommunityBin[];
  requests: CitizenRequest[];
  notifications: CivicNotification[];
  refreshData: () => void;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bins, setBins] = useState<CommunityBin[]>([]);
  const [requests, setRequests] = useState<CitizenRequest[]>([]);
  const [notifications, setNotifications] = useState<CivicNotification[]>([]);

  const fetchData = async () => {
    const { data: binsData } = await supabase.from('bins').select('*');
    if (binsData) setBins(binsData as any);

    const { data: reqData } = await supabase.from('citizen_requests').select('*');
    if (reqData) setRequests(reqData as any);
  };

  useEffect(() => {
    fetchData();

    const binsSub = supabase.channel('public:bins')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bins' }, fetchData)
      .subscribe();

    const reqSub = supabase.channel('public:requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'citizen_requests' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(binsSub);
      supabase.removeChannel(reqSub);
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ bins, requests, notifications, refreshData: fetchData }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabaseData = () => {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabaseData must be within SupabaseProvider");
  return ctx;
};
