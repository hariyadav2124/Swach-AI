import { supabase } from '../lib/supabase';
import { CitizenRequest } from '../types';

export const reportService = {
  async getRequests(): Promise<CitizenRequest[]> {
    const { data, error } = await supabase.from('citizen_requests').select('*, assigned_worker:profiles!assigned_worker_id(name, team, vehicle)');
    if (error) throw error;
    
    return data.map(req => ({
      id: req.id,
      type: req.type,
      title: req.title,
      binId: req.bin_id,
      location: req.location,
      sector: req.sector,
      coordinates: req.lat && req.lng ? [req.lat, req.lng] : undefined,
      submittedAt: req.submitted_at,
      updatedAt: req.updated_at,
      status: req.status,
      issueCategory: req.issue_category,
      description: req.description,
      photoUrl: req.photo_url,
      timeline: [], // Derived or stored in JSON
      assignedWorker: req.assigned_worker ? {
        name: req.assigned_worker.name,
        team: req.assigned_worker.team,
        vehicle: req.assigned_worker.vehicle
      } : undefined
    }));
  },

  async uploadReportImage(userId: string, reportId: string, file: File): Promise<string> {
    const filePath = `reports/${userId}/${reportId}/${file.name}`;
    const { data, error } = await supabase.storage.from('report-images').upload(filePath, file, { upsert: true });
    
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage.from('report-images').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  },

  subscribeToRequests(callback: (payload: any) => void) {
    return supabase
      .channel('public:citizen_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'citizen_requests' }, callback)
      .subscribe();
  }
};
