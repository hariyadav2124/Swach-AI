import { RouteStop, WorkerProfile, WorkerNotification, CollectionHistoryRecord } from '../types/worker';

export const INITIAL_WORKER_PROFILE: WorkerProfile = {
  name: 'Rohit Kumar',
  role: 'Waste Collection Worker',
  zone: 'Ward 14 · Sector 68',
  vehicle: 'PB-65-8821',
  shift: '07:00 AM – 03:00 PM',
  status: 'Off Duty',
  driverLicense: '',
  contact: '',
  depot: '',
};

export const INITIAL_ROUTE_STOPS: RouteStop[] = [];
export const INITIAL_WORKER_NOTIFICATIONS: WorkerNotification[] = [];
export const INITIAL_COLLECTION_HISTORY: CollectionHistoryRecord[] = [];
