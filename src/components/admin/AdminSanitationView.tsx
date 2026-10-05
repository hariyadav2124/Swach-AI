import React from 'react';
import { Sparkles, UserPlus } from 'lucide-react';
import { AdminBin, AdminWorker } from '../../types/admin';

interface AdminSanitationViewProps {
  bins: AdminBin[];
  workers: AdminWorker[];
  onAssignTask: (bin: AdminBin) => void;
  onSelectBin: (bin: AdminBin) => void;
}

export const AdminSanitationView: React.FC<AdminSanitationViewProps> = ({
  bins,
  workers,
  onAssignTask,
  onSelectBin,
}) => {
  const priorityBins = bins.filter((bin) => bin.status === 'critical' || bin.activeComplaintsCount > 0);
  const sanitationWorkers = workers.filter((worker) => worker.role === 'Sanitation Worker');

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="border-b border-neutral-200/80 pb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
          Public Hygiene & Disinfection
        </span>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">Sanitation Operations</h1>
        <p className="text-xs text-neutral-500 mt-1">Current sanitation-related bin records and assignments.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200/90">
          <span className="text-xs text-neutral-500 font-medium">Priority Bin Records</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">{priorityBins.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-200/90">
          <span className="text-xs text-neutral-500 font-medium">Sanitation Workers</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">{sanitationWorkers.length}</div>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-neutral-200/90 p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-neutral-900">Priority Sanitation Queue</h2>
        </div>
        {priorityBins.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4">No sanitation-related bin records.</p>
        ) : (
          <div className="space-y-3">
            {priorityBins.map((bin) => (
              <div key={bin.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-4">
                <button onClick={() => onSelectBin(bin)} className="text-left min-w-0">
                  <span className="font-mono text-xs font-bold text-neutral-900">{bin.id}</span>
                  <span className="font-bold text-sm text-neutral-900 ml-2">{bin.name}</span>
                  <span className="block text-xs text-neutral-500 mt-1">
                    {bin.sector} · {bin.activeComplaintsCount} complaints
                  </span>
                </button>
                {sanitationWorkers.length > 0 && (
                  <button
                    onClick={() => onAssignTask(bin)}
                    className="shrink-0 px-3 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Assign
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
