import React from 'react';
import { 
  Users, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  Award, 
  Activity,
  ShieldCheck
} from 'lucide-react';
import { AdminWorker } from '../../types/admin';

interface AdminWorkersViewProps {
  workers: AdminWorker[];
}

export const AdminWorkersView: React.FC<AdminWorkersViewProps> = ({ workers }) => {
  const collectionWorkers = workers.filter((w) => w.role === 'Collection Worker');
  const sanitationWorkers = workers.filter((w) => w.role === 'Sanitation Worker');

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              Field Operations Personnel
            </span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
            Worker Operations & Fleet Tracking
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time deployment of 12 compactor collection drivers and 6 high-pressure sanitation teams across Ward 14.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            18 Active On Duty
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold">
            2 On Break
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-600 font-bold">
            1 Offline
          </span>
        </div>
      </div>

      {/* Worker Cards Grid */}
      <div className="space-y-6">
        {/* Collection Fleet */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              Waste Collection Crew (12 Active Compactor Drivers)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectionWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white p-4 rounded-xl border border-neutral-200/90 hover:border-neutral-300 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs">
                      {worker.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm">{worker.name}</h3>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {worker.team} · Truck {worker.vehicle}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    worker.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {worker.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Current Position:</span>
                    <span className="font-bold text-neutral-900 truncate max-w-[170px]" title={worker.currentLocationName}>
                      {worker.currentLocationName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Shift Hours:</span>
                    <span className="font-mono text-neutral-700">{worker.shift}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Task Completion:</span>
                    <span className="font-mono font-bold text-neutral-900">
                      {worker.completedTasks} / {worker.totalTasks} bins ({Math.round((worker.completedTasks / worker.totalTasks) * 100)}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">On-Time SLA:</span>
                    <span className="font-mono font-bold text-emerald-700">{worker.onTimeRate}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-500 text-[11px]">{worker.contact}</span>
                  <a
                    href={`tel:${worker.contact}`}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="Direct call"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sanitation Fleet */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              Sanitation & Disinfection Crew (6 Active High-Pressure Teams)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sanitationWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white p-4 rounded-xl border border-neutral-200/90 hover:border-neutral-300 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 font-bold flex items-center justify-center text-xs">
                      {worker.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm">{worker.name}</h3>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {worker.team} · Van {worker.vehicle}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-teal-100 text-teal-800">
                    {worker.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Current Position:</span>
                    <span className="font-bold text-neutral-900 truncate max-w-[170px]" title={worker.currentLocationName}>
                      {worker.currentLocationName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Shift Hours:</span>
                    <span className="font-mono text-neutral-700">{worker.shift}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Sanitized Today:</span>
                    <span className="font-mono font-bold text-neutral-900">
                      {worker.completedTasks} / {worker.totalTasks} locations
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">On-Time SLA:</span>
                    <span className="font-mono font-bold text-teal-700">{worker.onTimeRate}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-500 text-[11px]">{worker.contact}</span>
                  <a
                    href={`tel:${worker.contact}`}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
