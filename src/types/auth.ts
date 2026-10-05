export type UserRole = 
  | 'CITIZEN' 
  | 'COLLECTION_WORKER' 
  | 'SANITATION_WORKER' 
  | 'MUNICIPAL_ADMIN';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DISABLED';

export type AccessChannel = 'citizen' | 'staff' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // phone number (+91 9876543210), Employee ID (CW-1048, SW-2031), or Official ID (ADM-0014)
  password?: string;
  otpCode?: string;
  status: AccountStatus;
  ward: string;
  zone: string;
  team?: string;
  shift?: string;
  vehicle?: string;
  badgeNumber?: string;
  email?: string;
  permissions: string[];
}

export interface AuthSession {
  authenticated: boolean;
  userId: string;
  role: UserRole;
  name: string;
  identifier: string;
  status: AccountStatus;
  ward: string;
  zone: string;
  team?: string;
  vehicle?: string;
  shift?: string;
  badgeNumber?: string;
  email?: string;
  permissions: string[];
  loginTimestamp: number;
  isFirstLoginSession?: boolean;
}

export interface AuthResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
  statusBlocked?: boolean;
}

export type AppRoutePath = 
  | '/login'
  | '/citizen'
  | '/collection'
  | '/sanitation'
  | '/admin'
  | '/unauthorized';
