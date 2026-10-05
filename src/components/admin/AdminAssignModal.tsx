import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Truck, 
  Sparkles, 
  Check, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { AdminBin, AdminWorker } from '../../types/admin';

interface AdminAssignModalProps {
  bin: AdminBin;
  workers: AdminWorker[];
  onClose: () => void;
  onConfirmAssignment: (binId: string, team: string, workerName: string, priority: string, notes?: string) => void;
}

export const AdminAssignModal: React.FC<AdminAssignModalProps> = ({
  bin,
  workers,
  onClose,
  onConfirmAssignment,
}) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id ?? '');
  const [priority, setPriority] = useState<string>('Immediate (within 1 hour)');
  const [notes, setNotes] = useState<string>('High fill detected. Ensure spillage around pavement is cleared.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = workers.find((w) => w.id === selectedWorkerId);
    if (!worker) return;
    onConfirmAssignment(bin.id, worker.team, `${worker.name} (${worker.vehicle})`, priority, notes);
  };

  if (workers.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-neutral-200 shadow-2xl">
          <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Assign Dispatch Order</h2>
              <p className="text-xs text-neutral-500 mt-1">No workers are available to assign.</p>
            </div>
            <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-neutral-200 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
          <div>
            <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {bin.id}
            </span>
            <h2 className="text-lg font-bold text-neutral-900 mt-1">Assign Dispatch Order</h2>
            <div className="text-xs text-neutral-500 truncate max-w-sm">{bin.name} · {bin.locationDescription}</div>
          </div>

          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Bin Overview */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between font-mono">
            <span>Current Fill: <strong className="text-rose-600">{bin.currentFill}%</strong></span>
            <span>Predicted Overflow: <strong className="text-rose-600">{bin.predictedCriticalIn}</strong></span>
          </div>

          {/* Select Worker / Fleet */}
          <div>
            <label className="block text-neutral-700 font-bold mb-1.5">Select Fleet Unit & Operator</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {workers.map((worker) => (
                <label
                  key={worker.id}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedWorkerId === worker.id
                      ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-2xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="worker"
                      checked={selectedWorkerId === worker.id}
                      onChange={() => setSelectedWorkerId(worker.id)}
                      className="accent-teal-600"
                    />
                    <div>
                      <div className="font-bold text-neutral-900">{worker.name} ({worker.vehicle})</div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {worker.team} · At {worker.currentLocationName.split(',')[0]}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {worker.completedTasks}/{worker.totalTasks} done
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-neutral-700 font-bold mb-1.5">Dispatch Urgency</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-800 focus:outline-none"
            >
              <option value="Immediate (within 1 hour)">🚨 Immediate (within 1 hour) - Override Active Stop</option>
              <option value="Next in Route Sequence">Next in Route Sequence (within 2-3 hours)</option>
              <option value="Schedule for Afternoon Shift">Schedule for Afternoon Shift</option>
            </select>
          </div>

          {/* Operator Instructions */}
          <div>
            <label className="block text-neutral-700 font-bold mb-1.5">Operator Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:bg-white resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-neutral-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Dispatch Unit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
