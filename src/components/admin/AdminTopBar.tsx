import React from 'react';
import { 
  Search, 
  Bell, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  Menu,
  LogOut
} from 'lucide-react';
import { ADMIN_PROFILE } from '../../data/mockAdminData';
import { AdminKPIs } from '../../types/admin';
import { AuthSession } from '../../types/auth';

interface AdminTopBarProps {
  kpis: AdminKPIs;
  unreadNotificationsCount: number;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onToggleMobileSidebar: () => void;
  session?: AuthSession | null;
  onSignOut?: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  kpis,
  unreadNotificationsCount,
  onOpenSearch,
  onOpenNotifications,
  onToggleMobileSidebar,
  session,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/90 h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Toggle & Jurisdiction Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200/60">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="font-semibold text-neutral-900">{ADMIN_PROFILE.jurisdiction}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200/40">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Today · Shift {ADMIN_PROFILE.shift}</span>
          </div>

          {/* Operational Status Indicator */}
          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
            kpis.criticalBins > 0
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${kpis.criticalBins > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
            <span>{kpis.criticalBins > 0 ? '● Attention required' : '● Operations normal'}</span>
          </div>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Shortcut */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg border border-neutral-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-neutral-500" />
          <span className="hidden sm:inline">Search bins, complaints, workers...</span>
          <span className="hidden md:inline-block text-[10px] bg-white text-neutral-400 px-1 py-0.5 rounded border border-neutral-200 font-mono">
            ⌘K
          </span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          title="Admin Operational Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* Admin Avatar */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-200">
          <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
            {session ? session.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'PM'}
          </div>
          <div className="text-left hidden xl:block">
            <div className="text-xs font-semibold text-neutral-900 leading-tight">{session?.name || ADMIN_PROFILE.name}</div>
            <div className="text-[10px] text-neutral-500 leading-none">{session?.identifier || 'ADM-0014'} · MC SAS Nagar</div>
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out to Login Gateway"
              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-md transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
