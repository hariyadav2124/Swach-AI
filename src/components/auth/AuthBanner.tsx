import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRightLeft, 
  ShieldAlert,
  Building2,
  Truck,
  Droplets,
  Smartphone
} from 'lucide-react';
import { AuthSession, UserRole } from '../../types/auth';
import { DEMO_PRESETS, MOCK_ACCOUNTS, createSessionFromAccount } from '../../data/mockAccounts';

interface AuthBannerProps {
  session: AuthSession;
  onSignOut: () => void;
  onSwitchSession: (newSession: AuthSession) => void;
  onSimulateUnauthorized?: (targetRole: UserRole) => void;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({
  session,
  onSignOut,
  onSwitchSession,
  onSimulateUnauthorized
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'CITIZEN':
        return {
          label: 'CITIZEN',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <Smartphone className="w-3 h-3" />
        };
      case 'COLLECTION_WORKER':
        return {
          label: 'COLLECTION WORKER',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <Truck className="w-3 h-3" />
        };
      case 'SANITATION_WORKER':
        return {
          label: 'SANITATION WORKER',
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          icon: <Droplets className="w-3 h-3" />
        };
      case 'MUNICIPAL_ADMIN':
        return {
          label: 'MUNICIPAL ADMIN',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: <Building2 className="w-3 h-3" />
        };
      default:
        return {
          label: role,
          bg: 'bg-neutral-50 text-neutral-800 border-neutral-200',
          icon: <User className="w-3 h-3" />
        };
    }
  };

  const badge = getRoleBadge(session.role);

  return (
    <div className="bg-neutral-900 text-white text-xs border-b border-neutral-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between flex-wrap gap-2">
        {/* Left: Active Session Identity */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline text-neutral-400">Authenticated:</span>
            <span className="font-semibold text-white">{session.name}</span>
          </div>

          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badge.bg}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </span>

          <span className="hidden md:inline font-mono text-[11px] text-neutral-400">
            [{session.identifier}]
          </span>

          <span className="hidden lg:inline text-[11px] text-neutral-400">
            · Ward {session.ward} ({session.zone})
          </span>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          {/* Quick Fast-Pass Persona Switcher Buttons for Reviewer */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-800/80 p-0.5 rounded-lg border border-neutral-700/60">
            {DEMO_PRESETS.map((preset, idx) => {
              const isCurrent = preset.account.role === session.role && preset.account.id === session.userId;
              return (
                <button
                  key={idx}
                  onClick={() => onSwitchSession(createSessionFromAccount(preset.account))}
                  title={`Fast switch to ${preset.account.name} (${preset.account.role})`}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                    isCurrent
                      ? 'bg-teal-700 text-white font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Toggle details / advanced panel */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-md text-[11px] border border-neutral-700"
          >
            <span>RBAC Details</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Sign Out / Exit to Login */}
          <button
            onClick={onSignOut}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded-md text-[11px] font-semibold border border-rose-800/80 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Expanded details bar (Permissions & Simulated RBAC testing) */}
      {isExpanded && (
        <div className="bg-neutral-950 px-4 py-3 border-t border-neutral-800 text-neutral-300 animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Authorized Cryptographic Permissions:</span>
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {session.permissions && session.permissions.length > 0 ? (
                  session.permissions.map((perm, i) => (
                    <span key={i} className="font-mono text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 border border-neutral-700">
                      {perm}
                    </span>
                  ))
                ) : (
                  <span className="text-neutral-500 italic">Standard citizen baseline privileges</span>
                )}
              </div>
            </div>

            {/* Test 403 Barrier action */}
            {onSimulateUnauthorized && (
              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                <span className="text-[11px] text-neutral-400">Security Test:</span>
                <button
                  type="button"
                  onClick={() => onSimulateUnauthorized(session.role === 'MUNICIPAL_ADMIN' ? 'CITIZEN' : 'MUNICIPAL_ADMIN')}
                  className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-800 rounded text-[11px] font-medium flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Simulate 403 Forbidden Access</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
