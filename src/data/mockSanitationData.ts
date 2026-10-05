import {
  SanitationTask,
  SanitationWorkerProfile,
  CitizenSanitationComplaint,
  SanitationHistoryRecord,
  SanitationNotification,
} from '../types/sanitation';

export const INITIAL_SANITATION_PROFILE: SanitationWorkerProfile = {
  name: 'Neha Verma',
  role: 'Sanitation Worker',
  zone: 'Ward 14 · Sector 68',
  team: 'Sanitation Unit B',
  vehicle: 'PB-65-4109',
  shift: '08:00 AM – 04:00 PM',
  status: 'Off Duty',
  badgeNumber: '',
  contact: '',
};

export const INITIAL_SANITATION_TASKS: SanitationTask[] = [];
export const INITIAL_CITIZEN_COMPLAINTS: CitizenSanitationComplaint[] = [];
export const INITIAL_SANITATION_HISTORY: SanitationHistoryRecord[] = [];
export const INITIAL_SANITATION_NOTIFICATIONS: SanitationNotification[] = [];
