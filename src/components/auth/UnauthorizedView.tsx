import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, UserCheck, AlertTriangle } from 'lucide-react';
import { AuthSession, UserRole } from '../../types/auth';

interface UnauthorizedViewProps {
  session: AuthSession;
  targetRole?: UserRole | string;
  onReturnToAuthorizedView: () => void;
  onSwitchAccount: () => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  session,
  targetRole = 'MUNICIPAL_ADMIN',
  onReturnToAuthorizedView,
  onSwitchAccount
}) => {
  const getRoleDisplayName = (r: UserRole): string => {
    switch (r) {
      case 'CITIZEN': return 'Citizen Account';
      case 'COLLECTION_WORKER': return 'Waste Collection Field Staff';
      case 'SANITATION_WORKER': return 'Sanitation & Disinfection Staff';
      case 'MUNICIPAL_ADMIN': return 'Municipality Operations Administrator';
      default: return r;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
          403 · Access Forbidden
        </span>

        <h2 className="text-2xl font-bold text-neutral-900 mt-3 mb-2">
          RBAC Security Barrier
        </h2>

        <p className="text-sm text-neutral-600 leading-relaxed mb-6">
          Your account does not possess the cryptographic permissions required to access the requested operational zone (<strong>{targetRole}</strong>).
        </p>

        {/* Identity Details Card */}
        <div className="bg-neutral-50 rounded-xl p-4 text-left border border-neutral-200 text-xs space-y-2 mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
            <span className="text-neutral-500">Authenticated Identity</span>
            <span className="font-bold text-neutral-900">{session.name}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
            <span className="text-neutral-500">Official Identifier</span>
            <span className="font-mono text-neutral-800">{session.identifier}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
            <span className="text-neutral-500">Assigned Role</span>
            <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {getRoleDisplayName(session.role)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Jurisdiction</span>
            <span className="text-neutral-700">Ward {session.ward} · {session.zone}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onReturnToAuthorizedView}
            className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Workspace</span>
          </button>

          <button
            type="button"
            onClick={onSwitchAccount}
            className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 font-medium text-sm rounded-xl transition-all"
          >
            Sign In with Different Credentials
          </button>
        </div>
      </div>
    </div>
  );
};
