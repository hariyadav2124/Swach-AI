export type AdminTab = 
  | 'overview'
  | 'live_map'
  | 'bins'
  | 'collection'
  | 'sanitation'
  | 'complaints'
  | 'new_bins'
  | 'workers'
  | 'routes'
  | 'predictions'
  | 'analytics'
  | 'reports'
  | 'settings';

export type BinAdminStatus = 'critical' | 'filling' | 'normal' | 'serviced';

export interface AdminBin {
  id: string;
  name: string;
  sector: 'Sector 68' | 'Sector 69' | 'Sector 70' | 'Sector 71';
  locationDescription: string;
  coordinates: [number, number];
  currentFill: number;
  capacityLitres: number;
  status: BinAdminStatus;
  lastCollectionTime: string;
  lastSanitationTime: string;
  predictedCriticalIn: string; // e.g. "45 minutes", "6 hours", "18 hours"
  predictedFillNext6h: number;
  predictedFillNext12h: number;
  confidence: 'High' | 'Medium' | 'Low';
  predictionReason: string;
  activeComplaintsCount: number;
  assignedTeam?: string;
  assignedWorker?: string;
  wasteTypes: ('dry' | 'wet' | 'sanitary')[];
  sensorHealth: 'online' | 'warning' | 'offline';
  dailyFillTrend: { hour: string; fill: number }[];
}

export interface AdminComplaint {
  id: string;
  binId: string;
  binName: string;
  sector: string;
  location: string;
  category: 'Overflow' | 'Bad Odour' | 'Spillage' | 'Damaged Bin' | 'Pest Infestation';
  submittedTime: string;
  urgency: 'critical' | 'high' | 'medium';
  status: 'New' | 'Assigned' | 'In Progress' | 'Escalated' | 'Resolved';
  slaHoursTotal: number;
  slaRemainingMinutes: number; // negative means overdue
  isOverdue: boolean;
  assignedTeam?: string;
  citizenName: string;
  citizenPhone: string;
  description: string;
  photoUrl?: string;
}

export interface AdminNewBinRequest {
  id: string;
  area: string;
  sector: string;
  coordinates: [number, number];
  requestCount: number;
  nearestBinMeters: number;
  wasteDemandLevel: 'Very High' | 'High' | 'Medium';
  status: 'Pending Review' | 'Under Inspection' | 'Approved' | 'Rejected';
  suggestedBy: string;
  dateSubmitted: string;
  justification: string;
  coverageGapScore: number; // 0-100
  photoUrl?: string;
}

export interface AdminWorker {
  id: string;
  name: string;
  role: 'Collection Worker' | 'Sanitation Worker';
  team: string;
  vehicle: string;
  status: 'Active' | 'On Break' | 'Offline';
  shift: string;
  currentBinId: string;
  currentLocationName: string;
  coordinates: [number, number];
  completedTasks: number;
  totalTasks: number;
  onTimeRate: number; // e.g. 94%
  contact: string;
}

export interface AdminRoute {
  id: string;
  name: string;
  type: 'Collection' | 'Sanitation';
  assignedTruck: string;
  workerName: string;
  totalBins: number;
  completedBins: number;
  criticalBins: number;
  delayedCount: number;
  totalDistanceKm: number;
  optimizedDistanceKm: number;
  potentialSavedKm: number;
  estimatedCompletion: string;
  status: 'On Schedule' | 'Delayed' | 'Completed';
  polylinePoints: [number, number][];
}

export interface AdminKPIs {
  totalBins: number;
  criticalBins: number;
  highRiskBins: number;
  normalBins: number;
  pendingRequests: number;
  activeWorkers: number;
  totalWorkers: number;
  todayCollectionsDone: number;
  todayCollectionsTotal: number;
  todaySanitationDone: number;
  todaySanitationTotal: number;
  systemStatus: 'Operational' | 'Attention Required';
  averageResponseMins: number;
  routeEfficiencyPercent: number;
}

export interface AdminNotification {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  relatedEntityId?: string;
  type: 'prediction' | 'sla_breach' | 'route_delay' | 'complaint' | 'request';
}
