import { supabase } from '../lib/supabase';
import { CommunityBin } from '../types';

export const binService = {
  async getBins(): Promise<CommunityBin[]> {
    const { data, error } = await supabase.from('bins').select('*');
    if (error) throw error;
    
    // Map DB schema to CommunityBin
    return data.map(dbBin => ({
      id: dbBin.id,
      name: dbBin.name,
      sector: dbBin.sector,
      locationDescription: dbBin.location_description,
      coordinates: [dbBin.lat, dbBin.lng] as [number, number],
      distanceMeters: 0, // Calculated client-side
      status: dbBin.status,
      fillLevel: dbBin.fill_level,
      lastCollection: dbBin.last_collection || '',
      lastCleaning: dbBin.last_cleaning || '',
      predictedCriticalTime: dbBin.predicted_critical_time,
      predictionReason: dbBin.prediction_reason || '',
      binTypes: dbBin.bin_types || [],
      activeReportsCount: dbBin.active_reports_count || 0,
      capacityLiters: dbBin.capacity_liters || 0,
      sensorBattery: dbBin.sensor_battery || 100,
      ward: dbBin.ward || ''
    }));
  },

  subscribeToBins(callback: (payload: any) => void) {
    return supabase
      .channel('public:bins')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bins' }, callback)
      .subscribe();
  }
};
