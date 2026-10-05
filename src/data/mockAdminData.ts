import {
  AdminBin,
  AdminComplaint,
  AdminNewBinRequest,
  AdminWorker,
  AdminRoute,
  AdminKPIs,
  AdminNotification,
} from '../types/admin';

export const ADMIN_PROFILE = {
  name: 'Priya Mehta',
  role: 'Municipal Operations Administrator',
  municipality: 'MC SAS Nagar',
  jurisdiction: 'Ward 14 · Sectors 68–71',
  shift: '07:00 AM – 03:00 PM',
  status: 'Operational',
  email: '',
  phone: '',
  controlRoomDesk: '',
};

export const INITIAL_ADMIN_KPIS: AdminKPIs = {
  totalBins: 0,
  criticalBins: 0,
  highRiskBins: 0,
  normalBins: 0,
  pendingRequests: 0,
  activeWorkers: 0,
  totalWorkers: 0,
  todayCollectionsDone: 0,
  todayCollectionsTotal: 0,
  todaySanitationDone: 0,
  todaySanitationTotal: 0,
  systemStatus: 'Operational',
  averageResponseMins: 0,
  routeEfficiencyPercent: 0,
};

export const INITIAL_ADMIN_BINS: AdminBin[] = [];
export const INITIAL_ADMIN_COMPLAINTS: AdminComplaint[] = [];
export const INITIAL_ADMIN_NEW_BINS: AdminNewBinRequest[] = [];
export const INITIAL_ADMIN_WORKERS: AdminWorker[] = [];
export const INITIAL_ADMIN_ROUTES: AdminRoute[] = [];
export const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [];
