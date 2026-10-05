import { CommunityBin, CitizenRequest, CivicNotification } from '../types';

export const SECTORS = [
  { id: 'sec-68', name: 'Sector 68, SAS Nagar', ward: 'Ward 14', lat: 30.6892, lng: 76.7265 },
  { id: 'sec-69', name: 'Sector 69, SAS Nagar', ward: 'Ward 15', lat: 30.6970, lng: 76.7198 },
  { id: 'sec-70', name: 'Sector 70, SAS Nagar', ward: 'Ward 16', lat: 30.7042, lng: 76.7125 },
  { id: 'phase-7', name: 'Phase 7, Urban Estate', ward: 'Ward 18', lat: 30.7120, lng: 76.7290 },
];

export const INITIAL_BINS: CommunityBin[] = [];
export const INITIAL_REQUESTS: CitizenRequest[] = [];
export const INITIAL_NOTIFICATIONS: CivicNotification[] = [];
