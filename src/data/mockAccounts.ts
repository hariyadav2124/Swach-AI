import { UserAccount, AuthSession, AuthResult, UserRole } from '../types/auth';

export const MOCK_ACCOUNTS: UserAccount[] = [
  // 1. Citizen Accounts
  {
    id: 'CIT-1001',
    name: 'Aman Sharma',
    role: 'CITIZEN',
    identifier: '+91 9876543210',
    otpCode: '123456',
    status: 'ACTIVE',
    ward: '14',
    zone: 'Sector 68',
    email: 'aman.sharma@example.com',
    permissions: [
      'report_issue',
      'request_cleaning',
      'request_new_bin',
      'view_bins',
      'scan_waste',
      'track_own_requests'
    ]
  },
  // 2. Collection Worker Account
  {
    id: 'CW-1048',
    name: 'Rohit Kumar',
    role: 'COLLECTION_WORKER',
    identifier: 'CW-1048',
    password: 'demo123',
    status: 'ACTIVE',
    ward: '14',
    zone: 'Sector 68',
    team: 'Collection Team A',
    shift: '06:00 AM – 02:00 PM',
    vehicle: 'PB-65-AX-4091 (Heavy Compactor)',
    badgeNumber: 'CW-1048',
    email: 'rohit.kumar@sasnagar.gov.in',
    permissions: [
      'view_route',
      'complete_collection',
      'report_problem',
      'update_bin_status',
      'view_worker_telemetry'
    ]
  },

  // 3. Sanitation Worker Account
  {
    id: 'SW-2031',
    name: 'Neha Verma',
    role: 'SANITATION_WORKER',
    identifier: 'SW-2031',
    password: 'demo123',
    status: 'ACTIVE',
    ward: '14',
    zone: 'Sector 68',
    team: 'Sanitation Unit B',
    shift: '07:00 AM – 03:00 PM',
    vehicle: 'PB-65-SN-8820 (Disinfection Unit)',
    badgeNumber: 'SW-2031',
    email: 'neha.verma@sasnagar.gov.in',
    permissions: [
      'view_sanitation_route',
      'log_disinfection',
      'escalate_hazard',
      'inspect_chemical_levels',
      'upload_clean_proof'
    ]
  },

  // 4. Municipality Operations Administrator
  {
    id: 'ADM-0014',
    name: 'Priya Mehta',
    role: 'MUNICIPAL_ADMIN',
    identifier: 'ADM-0014',
    password: 'admin123',
    status: 'ACTIVE',
    ward: '14',
    zone: 'Sectors 68–71',
    shift: '07:00 AM – 03:00 PM',
    email: 'priya.mehta@sasnagar.gov.in',
    permissions: [
      'all_access',
      'manage_bins',
      'assign_workers',
      'resolve_complaints',
      'approve_new_bins',
      'view_predictions',
      'export_reports',
      'manage_routes',
      'broadcast_alerts'
    ]
  }
];

export const DEMO_PRESETS = [
  {
    label: 'Citizen',
    account: MOCK_ACCOUNTS[0],
    hint: 'Aman Sharma (+91 9876543210)',
    description: 'Report issues, scan waste, find nearby community bins'
  },
  {
    label: 'Collection Worker',
    account: MOCK_ACCOUNTS[1],
    hint: 'CW-1048 · Rohit Kumar',
    description: 'Follow collection route, record bin clearance, flag overflowing stops'
  },
  {
    label: 'Sanitation Worker',
    account: MOCK_ACCOUNTS[2],
    hint: 'SW-2031 · Neha Verma',
    description: 'Disinfect bins, high-pressure jet washing, biohazard containment'
  },
  {
    label: 'Municipal Admin',
    account: MOCK_ACCOUNTS[3],
    hint: 'ADM-0014 · Priya Mehta',
    description: 'Command center, AI overflow prediction, live ops map, dispatch'
  }
];

/**
 * Creates an authenticated session object from a verified user account.
 */
export function createSessionFromAccount(account: UserAccount): AuthSession {
  return {
    authenticated: true,
    userId: account.id,
    role: account.role,
    name: account.name,
    identifier: account.identifier,
    status: account.status,
    ward: account.ward,
    zone: account.zone,
    team: account.team,
    vehicle: account.vehicle,
    shift: account.shift,
    badgeNumber: account.badgeNumber,
    email: account.email,
    permissions: account.permissions,
    loginTimestamp: Date.now()
  };
}

/**
 * Normalizes phone strings by removing spaces, dashes, and standardizing +91 prefix
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `+91 ${digits}`;
  }
  if (digits.startsWith('91') && digits.length === 12) {
    return `+91 ${digits.slice(2)}`;
  }
  return phone.trim();
}

/**
 * Authenticates a Citizen account via mobile number and 6-digit OTP code.
 * Strictly enforces RBAC: Staff/Admin accounts cannot enter through Citizen channel.
 */
export function authenticateCitizen(rawPhone: string, otp: string): AuthResult {
  const cleanPhone = rawPhone.trim().replace(/\s+/g, ' ');
  const normalized = normalizePhone(rawPhone);

  // Cross-channel detection: did the user enter a staff ID or admin credential?
  if (/^(CW-|SW-|ADM-)/i.test(rawPhone.trim())) {
    return {
      success: false,
      error: 'This credential belongs to municipal personnel. Please switch to the Municipal Staff or Administration login channel.'
    };
  }

  // Lookup in accounts list
  const account = MOCK_ACCOUNTS.find(
    (acc) =>
      acc.identifier === normalized ||
      acc.identifier.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')
  );

  if (!account) {
    return {
      success: false,
      error: `Mobile number ${normalized} is not registered in the Ward 14 citizen database. Please check your number or try +91 9876543210.`
    };
  }

  // Verify that the account's authentic role is indeed CITIZEN
  if (account.role !== 'CITIZEN') {
    return {
      success: false,
      error: 'This account is registered for municipal operations staff access. Please use the official staff login.'
    };
  }

  // Check account standing
  if (account.status === 'SUSPENDED' || account.status === 'DISABLED') {
    return {
      success: false,
      statusBlocked: true,
      error: `Your citizen account (${account.name}) is currently ${account.status.toLowerCase()}. Please contact the MC SAS Nagar helpline.`
    };
  }

  // Verify OTP (allow universal prototype code '123456' or account specific code)
  const trimmedOtp = otp.trim();
  if (trimmedOtp !== '123456' && trimmedOtp !== account.otpCode) {
    return {
      success: false,
      error: 'Invalid 6-digit OTP code. For this prototype, use demo code: 123456.'
    };
  }

  return {
    success: true,
    session: createSessionFromAccount(account)
  };
}

/**
 * Authenticates Municipal Staff (Collection Worker or Sanitation Worker).
 * The user submits Employee ID + Password. The SYSTEM determines the exact role
 * (COLLECTION_WORKER vs SANITATION_WORKER). User NEVER picks their role!
 */
export function authenticateStaff(rawEmployeeId: string, password: string): AuthResult {
  const employeeId = rawEmployeeId.trim().toUpperCase();

  // Cross-channel detection: did the user enter a citizen phone or admin ID?
  if (/^\+?91\d{10}$/.test(rawEmployeeId.replace(/[\s-]/g, '')) || /^\d{10}$/.test(rawEmployeeId)) {
    return {
      success: false,
      error: 'Citizens must sign in via the Citizen Mobile OTP channel. Please switch to the Citizen login tab.'
    };
  }

  if (employeeId.startsWith('ADM-')) {
    return {
      success: false,
      error: 'Administrator credentials require the Municipality Administration portal. Please switch to the Administration access channel.'
    };
  }

  // Look up staff by Employee ID or badge number
  const account = MOCK_ACCOUNTS.find(
    (acc) =>
      acc.identifier.toUpperCase() === employeeId ||
      acc.id.toUpperCase() === employeeId ||
      (acc.badgeNumber && acc.badgeNumber.toUpperCase() === employeeId)
  );

  if (!account) {
    return {
      success: false,
      error: `Employee ID "${employeeId}" not found in Municipal Staff Directory. Valid demo IDs: CW-1048 (Collection) or SW-2031 (Sanitation).`
    };
  }

  // Ensure role is a municipal staff role
  if (account.role !== 'COLLECTION_WORKER' && account.role !== 'SANITATION_WORKER') {
    return {
      success: false,
      error: 'This account is not designated as municipal operational field staff.'
    };
  }

  // Check account standing
  if (account.status === 'SUSPENDED' || account.status === 'DISABLED') {
    return {
      success: false,
      statusBlocked: true,
      error: `Staff account ${account.identifier} (${account.name}) is marked as ${account.status}. Contact Ward 14 Dispatch Superintendent.`
    };
  }

  // Verify password (default demo password is 'demo123')
  if (password.trim() !== 'demo123' && password.trim() !== account.password) {
    return {
      success: false,
      error: 'Incorrect staff password. Use prototype password: demo123'
    };
  }

  return {
    success: true,
    session: createSessionFromAccount(account)
  };
}

/**
 * Authenticates Municipal Administration (Command Center).
 * Administrator enters Official Admin ID (ADM-0014) or official email + admin password.
 */
export function authenticateAdmin(rawIdentifier: string, password: string): AuthResult {
  const idOrEmail = rawIdentifier.trim().toLowerCase();

  // Cross-channel detection: did staff or citizen try to log into admin?
  if (/^(CW-|SW-)/i.test(rawIdentifier.trim())) {
    return {
      success: false,
      error: 'Field operational staff credentials cannot access the Executive Command Center. Please use the Municipal Staff portal.'
    };
  }

  const account = MOCK_ACCOUNTS.find(
    (acc) =>
      acc.identifier.toLowerCase() === idOrEmail ||
      acc.id.toLowerCase() === idOrEmail ||
      (acc.email && acc.email.toLowerCase() === idOrEmail)
  );

  if (!account) {
    return {
      success: false,
      error: `Administrative identity "${rawIdentifier}" is not recognized. Demo ID: ADM-0014 or priya.mehta@sasnagar.gov.in`
    };
  }

  if (account.role !== 'MUNICIPAL_ADMIN') {
    return {
      success: false,
      error: 'Access restricted: account does not hold MUNICIPAL_ADMIN credentials.'
    };
  }

  if (account.status === 'SUSPENDED' || account.status === 'DISABLED') {
    return {
      success: false,
      statusBlocked: true,
      error: `Administrator account is ${account.status.toLowerCase()}. Security clearance revocation in effect.`
    };
  }

  if (password.trim() !== 'admin123' && password.trim() !== account.password) {
    return {
      success: false,
      error: 'Invalid administrator password. Use prototype password: admin123'
    };
  }

  return {
    success: true,
    session: createSessionFromAccount(account)
  };
}

export const SESSION_STORAGE_KEY = 'civicwaste_auth_session';

export function loadStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (session && session.authenticated && session.userId && session.role) {
      return session;
    }
  } catch {
    // Ignore storage parse error
  }
  return null;
}

export function saveSession(session: AuthSession | null): void {
  try {
    if (!session) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    // Ignore storage write error
  }
}
