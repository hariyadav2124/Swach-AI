export type BinStatus = 'normal' | 'filling' | 'critical' | 'serviced';

export type WasteStreamType = 'dry' | 'wet' | 'hazardous' | 'sanitary';

export interface CommunityBin {
  id: string;
  name: string;
  sector: string;
  locationDescription: string;
  coordinates: [number, number]; // [lat, lng]
  distanceMeters: number;
  status: BinStatus;
  fillLevel: number; // 0 - 100
  lastCollection: string;
  lastCleaning: string;
  predictedCriticalTime: string | null;
  predictionReason?: string;
  binTypes: WasteStreamType[];
  activeReportsCount: number;
  capacityLiters: number;
  sensorBattery: number;
  ward: string;
}

export type RequestType = 'complaint' | 'cleaning' | 'new_bin';

export type RequestStatus = 
  | 'submitted' 
  | 'assigned' 
  | 'in_progress' 
  | 'resolved' 
  | 'rejected' 
  | 'escalated';

export interface TimelineEvent {
  title: string;
  time: string;
  note?: string;
  done: boolean;
}

export interface CitizenRequest {
  id: string;
  type: RequestType;
  title: string;
  binId?: string;
  location: string;
  sector: string;
  coordinates?: [number, number];
  submittedAt: string;
  updatedAt: string;
  status: RequestStatus;
  issueCategory?: string;
  description: string;
  photoUrl?: string;
  timeline: TimelineEvent[];
  assignedWorker?: {
    name: string;
    team: string;
    vehicle: string;
  };
  citizenConfirmed?: boolean;
}

export interface CivicNotification {
  id: string;
  type: 'critical_bin' | 'request_update' | 'cleaning_assigned' | 'review';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedBinId?: string;
  relatedRequestId?: string;
}

export interface WasteClassificationResult {
  itemName: string;
  category: string;
  confidence: number;
  recommendedBinColor: string;
  disposalInstructions: string[];
  notes: string;
  isConfident: boolean;
  photoUrl?: string;
}

export type AppTab = 
  | 'home' 
  | 'map' 
  | 'scanner' 
  | 'report' 
  | 'sanitization' 
  | 'new_bin' 
  | 'requests' 
  | 'notifications' 
  | 'profile';

export type LanguageCode = 'en' | 'hi';
