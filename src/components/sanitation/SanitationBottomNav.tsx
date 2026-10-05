import React from 'react';
import { Gauge, Sparkles, Map, History, User } from 'lucide-react';
import { SanitationTab } from '../../types/sanitation';

interface SanitationBottomNavProps {
  currentTab: SanitationTab;
  setCurrentTab: (tab: SanitationTab) => void;
  pendingCount: number;
}

export const SanitationBottomNav: React.FC<SanitationBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  pendingCount,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-neutral-950/98 backdrop-blur-md border-t border-neutral-800 lg:hidden pb-safe">
      <div className="grid grid-cols-5 h-16 items-center max-w-lg mx-auto px-2 text-neutral-400">
        {/* Home */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'dashboard' ? 'text-teal-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Gauge className={`w-5 h-5 ${currentTab === 'dashboard' ? 'stroke-[2.5px] text-teal-400' : ''}`} />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        {/* Priority Queue */}
        <button
          onClick={() => setCurrentTab('priority')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'priority' ? 'text-teal-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span className="text-xs font-bold text-amber-400">⚠️</span>
          <span className="text-[10px] mt-1">Priority</span>
        </button>

        {/* Central Tasks Hero Action */}
        <div className="flex items-center justify-center -mt-5">
          <button
            onClick={() => setCurrentTab('route')}
            className={`w-13 h-13 rounded-full flex flex-col items-center justify-center shadow-lg transition-all transform active:scale-95 ${
              currentTab === 'route'
                ? 'bg-teal-500 text-neutral-950 ring-4 ring-neutral-700 font-bold'
                : 'bg-teal-600 hover:bg-teal-500 text-neutral-950 ring-4 ring-teal-950'
            }`}
            aria-label="Tasks"
          >
            <Sparkles className="w-5 h-5 text-neutral-950" />
            <span className="text-[9px] font-bold tracking-tight text-neutral-950 mt-0.5">Tasks</span>
          </button>
        </div>

        {/* History */}
        <button
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'history' ? 'text-teal-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <History className={`w-5 h-5 ${currentTab === 'history' ? 'stroke-[2.5px] text-teal-400' : ''}`} />
          <span className="text-[10px] mt-1">History</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'profile' ? 'text-teal-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5px] text-teal-400' : ''}`} />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
