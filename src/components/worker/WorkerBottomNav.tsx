import React from 'react';
import { Gauge, Truck, Map, AlertTriangle, User } from 'lucide-react';
import { WorkerTab } from '../../types/worker';

interface WorkerBottomNavProps {
  currentTab: WorkerTab;
  setCurrentTab: (tab: WorkerTab) => void;
  pendingCount: number;
}

export const WorkerBottomNav: React.FC<WorkerBottomNavProps> = ({
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
            currentTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Gauge className={`w-5 h-5 ${currentTab === 'dashboard' ? 'stroke-[2.5px] text-emerald-400' : ''}`} />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        {/* Priority Tasks */}
        <button
          onClick={() => setCurrentTab('priority')}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            currentTab === 'priority' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <AlertTriangle className={`w-5 h-5 ${currentTab === 'priority' ? 'stroke-[2.5px] text-amber-400' : ''}`} />
          <span className="text-[10px] mt-1">Priority</span>
        </button>

        {/* Central Route Hero CTA (Primary action) */}
        <div className="flex items-center justify-center -mt-5">
          <button
            onClick={() => setCurrentTab('route')}
            className={`w-13 h-13 rounded-full flex flex-col items-center justify-center shadow-lg transition-all transform active:scale-95 ${
              currentTab === 'route'
                ? 'bg-emerald-500 text-neutral-950 ring-4 ring-neutral-700 font-bold'
                : 'bg-emerald-600 hover:bg-emerald-500 text-neutral-950 ring-4 ring-emerald-950'
            }`}
            aria-label="Today's Route"
          >
            <Truck className="w-5 h-5 text-neutral-950" />
            <span className="text-[9px] font-bold tracking-tight text-neutral-950 mt-0.5">Route</span>
          </button>
        </div>

        {/* Map */}
        <button
          onClick={() => setCurrentTab('map')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'map' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Map className={`w-5 h-5 ${currentTab === 'map' ? 'stroke-[2.5px] text-emerald-400' : ''}`} />
          <span className="text-[10px] mt-1">Map</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5px] text-emerald-400' : ''}`} />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
