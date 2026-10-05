export type StopUrgency = 'critical' | 'high' | 'normal';

export type StopStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'attention_required';

export interface RouteStop {
  id: string;
  order: number;
  binId: string;
  name: string;
  sector: string;
  locationDescription: string;
  coordinates: [number, number]; // [lat, lng]
  distance: string;
  distanceMeters: number;
  status: StopStatus;
  urgency: StopUrgency;
  estimatedFill: number;
  predictedCriticalTime: string | null;
  priorityReason: string;
  priorityCategory: string; // e.g. "Predicted overflow within 1 hour"
  capacityKg: number;
  historicalRateKgPerHour: number;
  recentCitizenReports: number;
  collectedKg?: number;
  collectedTime?: string;
  photoProof?: string;
  notes?: string;
  issueReported?: {
    category: string;
    description: string;
    photo?: string;
    timestamp: string;
  };
  fillHistory24h: { hour: string; fill: number }[];
}

export interface WorkerProfile {
  name: string;
  role: string;
  zone: string;
  vehicle: string;
  shift: string;
  status: 'On Duty' | 'On Break' | 'Off Duty';
  driverLicense: string;
  contact: string;
  depot: string;
}

export interface WorkerNotification {
  id: string;
  type: 'critical' | 'route_update' | 'task_assigned' | 'complaint' | 'vehicle';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  binId?: string;
}

export interface CollectionHistoryRecord {
  id: string;
  binId: string;
  name: string;
  location: string;
  collectionTime: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier this week';
  quantityKg: number;
  status: 'Completed' | 'Attention Required';
  photoUrl: string;
  vehicle: string;
  operatorNotes?: string;
}

export type WorkerTab = 
  | 'dashboard' 
  | 'route' 
  | 'priority' 
  | 'map' 
  | 'tasks' 
  | 'history' 
  | 'notifications' 
  | 'profile';
