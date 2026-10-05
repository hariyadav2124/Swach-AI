export type SanitationUrgency = 'critical' | 'high' | 'medium' | 'normal';

export type SanitationStatus = 'pending' | 'in_progress' | 'completed' | 'escalated';

export type SanitationActionType = 
  | 'Routine cleaning'
  | 'Deep cleaning'
  | 'Disinfection'
  | 'Spillage cleanup'
  | 'Odour treatment'
  | 'Pest treatment'
  | 'Emergency cleanup';

export interface SanitationChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface SanitationTask {
  id: string;
  order: number;
  binId: string;
  name: string;
  sector: string;
  locationDescription: string;
  coordinates: [number, number];
  distance: string;
  distanceMeters: number;
  urgency: SanitationUrgency;
  status: SanitationStatus;
  primaryIssue: string;
  priorityReason: string;
  priorityCategory: string; // e.g. "Overflow cleanup + repeated odour complaints"
  lastCleaned: string;
  citizenReportCount: number;
  recommendedActions: string[];
  checklist: SanitationChecklistItem[];
  beforePhoto?: string;
  afterPhoto?: string;
  performedActions?: SanitationActionType[];
  notes?: string;
  completedAt?: string;
  escalationReason?: string;
  previousIssue?: string;
}

export interface CitizenSanitationComplaint {
  id: string;
  binId: string;
  binName: string;
  location: string;
  issue: string;
  reportedTime: string;
  urgency: SanitationUrgency;
  status: 'Assigned' | 'In Progress' | 'Resolved';
  reportCount: number;
  citizenDescription: string;
  photoUrl?: string;
}

export interface SanitationHistoryRecord {
  id: string;
  binId: string;
  name: string;
  location: string;
  taskType: string;
  completionTime: string;
  dateGroup: 'Today' | 'Yesterday' | 'This Week';
  status: 'Completed' | 'Escalated';
  beforePhoto: string;
  afterPhoto: string;
  actionsPerformed: string[];
  operatorNotes?: string;
  workerName: string;
  team: string;
}

export interface SanitationWorkerProfile {
  name: string;
  role: string;
  zone: string;
  team: string;
  vehicle: string;
  shift: string;
  status: 'On Duty' | 'On Break' | 'Off Duty';
  badgeNumber: string;
  contact: string;
}

export interface SanitationNotification {
  id: string;
  type: 'critical' | 'task_assigned' | 'complaint' | 'route_update' | 'equipment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  binId?: string;
}

export type SanitationTab = 
  | 'dashboard' 
  | 'route' 
  | 'priority' 
  | 'map' 
  | 'complaints' 
  | 'history' 
  | 'notifications' 
  | 'profile';
