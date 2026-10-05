import React from 'react';
import { 
  Gauge, 
  Map, 
  Trash2, 
  Truck, 
  Sparkles, 
  MessageSquare, 
  PlusCircle, 
  Users, 
  Route as RouteIcon, 
  BrainCircuit, 
  BarChart3, 
  FileText, 
  Settings,
  ShieldAlert,
  ChevronRight,
  Activity
} from 'lucide-react';
import { AdminTab } from '../../types/admin';
import { ADMIN_PROFILE } from '../../data/mockAdminData';

interface AdminSidebarProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  pendingComplaintsCount: number;
  criticalBinsCount: number;
  pendingNewBinsCount: number;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  setCurrentTab,
  pendingComplaintsCount,
  criticalBinsCount,
  pendingNewBinsCount,
  isOpenOnMobile,
  onCloseMobile,
}) => {
  const navSections: NavSection[] = [
    {
      group: 'OPERATIONS',
      items: [
        { id: 'overview' as AdminTab, label: 'Overview', icon: Gauge, badge: criticalBinsCount > 0 ? `${criticalBinsCount} crit` : undefined, badgeColor: 'bg-rose-500' },
        { id: 'live_map' as AdminTab, label: 'Live Operations', icon: Map },
        { id: 'bins' as AdminTab, label: 'Community Bins', icon: Trash2 },
      ],
    },
    {
      group: 'FIELD SERVICES',
      items: [
        { id: 'collection' as AdminTab, label: 'Collection', icon: Truck },
        { id: 'sanitation' as AdminTab, label: 'Sanitation', icon: Sparkles },
        { id: 'complaints' as AdminTab, label: 'Complaints', icon: MessageSquare, badge: pendingComplaintsCount > 0 ? `${pendingComplaintsCount}` : undefined, badgeColor: 'bg-amber-500' },
        { id: 'new_bins' as AdminTab, label: 'New Bin Requests', icon: PlusCircle, badge: pendingNewBinsCount > 0 ? `${pendingNewBinsCount}` : undefined, badgeColor: 'bg-indigo-500' },
        { id: 'workers' as AdminTab, label: 'Workers', icon: Users },
        { id: 'routes' as AdminTab, label: 'Routes', icon: RouteIcon },
      ],
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { id: 'predictions' as AdminTab, label: 'Predictions', icon: BrainCircuit, highlight: true },
        { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
        { id: 'reports' as AdminTab, label: 'Reports', icon: FileText },
        { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleSelect = (tab: AdminTab) => {
    setCurrentTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-neutral-300 flex flex-col border-r border-neutral-800 transition-transform duration-200
      lg:static lg:translate-x-0 ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Brand & Municipal Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500 text-neutral-950 flex items-center justify-center font-bold text-sm shadow-sm">
            ❖
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white tracking-tight text-sm">CivicWaste</span>
              <span className="text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-500/40 px-1 py-0.2 rounded">
                COMMAND
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              MC SAS Nagar · Control
            </div>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-neutral-400 hover:text-white rounded"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs scrollbar-none">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider text-neutral-500">
              {section.group}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500 text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : item.highlight ? 'text-teal-400' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold text-white ${isActive ? 'bg-neutral-900' : item.badgeColor || 'bg-neutral-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Administrator Profile Footer */}
      <div className="p-3 border-t border-neutral-800 shrink-0 bg-neutral-950/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-neutral-900/90 border border-neutral-800">
          <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-500/50 text-teal-300 flex items-center justify-center font-bold text-xs">
            PM
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">{ADMIN_PROFILE.name}</div>
            <div className="text-[10px] text-neutral-400 truncate">MC SAS Nagar · Desk 04</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online & Operational"></span>
        </div>
      </div>
    </aside>
  );
};
