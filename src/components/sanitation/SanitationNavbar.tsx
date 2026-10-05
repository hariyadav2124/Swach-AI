import React from 'react';
import { 
  Sparkles, 
  Map, 
  AlertTriangle, 
  History, 
  Bell, 
  User, 
  MessageSquare, 
  Gauge,
  LogOut
} from 'lucide-react';
import { SanitationTab, SanitationWorkerProfile } from '../../types/sanitation';
import { AuthSession } from '../../types/auth';

interface SanitationNavbarProps {
  currentTab: SanitationTab;
  setCurrentTab: (tab: SanitationTab) => void;
  workerProfile: SanitationWorkerProfile;
  setWorkerProfile: React.Dispatch<React.SetStateAction<SanitationWorkerProfile>>;
  unreadCount: number;
  session?: AuthSession | null;
  onSignOut?: () => void;
}

export const SanitationNavbar: React.FC<SanitationNavbarProps> = ({
  currentTab,
  setCurrentTab,
  workerProfile,
  setWorkerProfile,
  unreadCount,
  session,
  onSignOut,
}) => {
  const navItems = [
    { id: 'dashboard' as SanitationTab, label: 'Dashboard', icon: Gauge },
    { id: 'route' as SanitationTab, label: "Today's Route", icon: Sparkles, highlight: true },
    { id: 'priority' as SanitationTab, label: 'Priority Tasks', icon: AlertTriangle },
    { id: 'map' as SanitationTab, label: 'Sanitation Map', icon: Map },
    { id: 'complaints' as SanitationTab, label: 'Complaints', icon: MessageSquare },
    { id: 'history' as SanitationTab, label: 'Task History', icon: History },
    { id: 'notifications' as SanitationTab, label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile' as SanitationTab, label: 'Profile', icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-neutral-900 text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Operational Badge */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-500 text-neutral-950 flex items-center justify-center font-bold text-base shadow-sm">
                <Sparkles className="w-5 h-5 text-neutral-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white tracking-tight text-base">CivicWaste</span>
                  <span className="text-[11px] font-mono text-teal-300 bg-teal-950/90 px-1.5 py-0.5 rounded text-xs border border-teal-500/40 font-bold tracking-wider">
                    SANITATION
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 font-normal leading-none hidden sm:block">
                  MC SAS Nagar · {workerProfile.team} ({workerProfile.vehicle})
                </div>
              </div>
            </button>

            {/* Duty Status Badge */}
            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-neutral-800">
              <div className="flex items-center gap-2 bg-neutral-800/80 border border-neutral-700 px-2.5 py-1 rounded-md text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="text-neutral-300 font-semibold">{workerProfile.status}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-400 font-mono">{workerProfile.zone}</span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Button */}
            <button
              onClick={() => setCurrentTab('notifications')}
              className="relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
              title="Sanitation Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-neutral-900"></span>
              )}
            </button>

            {/* Avatar */}
            <button
              onClick={() => setCurrentTab('profile')}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-md hover:bg-neutral-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-teal-500 text-neutral-950 flex items-center justify-center text-xs font-bold">
                {session ? session.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'NV'}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-white leading-tight">{session?.name || workerProfile.name}</div>
                <div className="text-[10px] text-neutral-400 leading-none font-mono">{session?.identifier || 'SW-2031'} · Unit B</div>
              </div>
            </button>

            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign Out to Login Gateway"
                className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Horizontal Navigation */}
      <nav className="hidden lg:block bg-neutral-950 border-b border-neutral-800 text-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors relative ${
                    isActive
                      ? 'bg-teal-500 text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-950' : item.highlight ? 'text-teal-400' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-neutral-900 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
